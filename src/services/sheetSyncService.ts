import { adminDataService, type AdminLead, type AdminCampaign, type AdminVenue } from './adminDataService';
import { getSheetsWebhookUrl } from './sheetService';

export interface SyncResult {
  success: boolean;
  message: string;
  probeOnly?: boolean;
  counts?: {
    leads: number;
    venues: number;
    campaigns: number;
  };
}

export interface SheetSyncState {
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  lastError: string | null;
  syncCount: number;
}

export function normalizeSheetLeadStatus(rawStatus?: string): AdminLead['status'] {
  if (!rawStatus) return 'new';
  const s = String(rawStatus).toLowerCase().trim();
  if (s === 'new' || s === 'new lead' || s === 'unread' || s === 'pending') return 'new';
  if (s === 'contacted' || s === 'reached out') return 'contacted';
  if (s === 'in progress' || s === 'negotiating' || s === 'qualified' || s === 'review') return 'negotiating';
  if (s === 'won / active' || s === 'won' || s === 'active' || s === 'converted' || s === 'closed - won' || s === 'won/active') return 'converted';
  if (s === 'closed / lost' || s === 'closed' || s === 'lost' || s === 'archived' || s === 'closed/lost') return 'archived';
  return 'new';
}

export function normalizeSheetPriority(rawPriority?: string): AdminLead['priority'] {
  if (!rawPriority) return 'medium';
  const p = String(rawPriority).toLowerCase().trim();
  if (p === 'high') return 'high';
  if (p === 'low') return 'low';
  return 'medium';
}

export function normalizeSheetFormType(rawSource?: string): string {
  if (!rawSource) return 'Website Lead';
  const s = String(rawSource).toLowerCase().trim();
  if (s.includes('contact')) return 'Contact Page Inquiry';
  if (s.includes('advertiser')) return 'Advertisers Page Lead';
  if (s.includes('partner') || s.includes('retail')) return 'Retail Partner Inquiry';
  if (s.includes('newsletter')) return 'Newsletter Subscription';
  return String(rawSource).trim();
}

let syncState: SheetSyncState = {
  isSyncing: false,
  lastSyncedAt: null,
  lastError: null,
  syncCount: 0,
};

const listeners = new Set<(state: SheetSyncState) => void>();
let autoSyncIntervalId: number | null = null;
let isVisibilityBound = false;

function updateSyncState(updates: Partial<SheetSyncState>) {
  syncState = { ...syncState, ...updates };
  listeners.forEach((fn) => {
    try {
      fn(syncState);
    } catch (e) {
      console.error('Sync listener error:', e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('yedz_sheet_sync_status', { detail: syncState }));
  }
}

export const sheetSyncService = {
  getWebhookUrl(): string {
    return getSheetsWebhookUrl();
  },

  getSyncState(): SheetSyncState {
    return syncState;
  },

  subscribe(listener: (state: SheetSyncState) => void): () => void {
    listeners.add(listener);
    listener(syncState);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Push an entity change (create, update, delete) to Google Sheets.
   * Google Apps Script Web Apps redirect after POST which triggers CORS errors in
   * browsers. Using no-cors mode silences the error — the row still records successfully.
   */
  async pushToSheet(payload: Record<string, unknown>): Promise<boolean> {
    const url = this.getWebhookUrl();
    if (!url) return false;

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      return true;
    } catch (err) {
      console.warn('Google Sheet push non-blocking error:', err);
      return false;
    }
  },

  /**
   * Synchronize all data from Google Sheets into the local Admin database
   */
  async fetchFromSheet(): Promise<SyncResult> {
    const url = this.getWebhookUrl();
    if (!url) {
      updateSyncState({ isSyncing: false, lastError: 'No Google Sheets URL configured' });
      return { success: false, message: 'No Google Sheets webhook URL configured in .env' };
    }

    updateSyncState({ isSyncing: true, lastError: null });

    try {
      const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}action=getData&t=${Date.now()}`;
      const response = await fetch(fetchUrl, {
        method: 'GET',
        redirect: 'follow',
      });

      if (!response.ok && response.status !== 0) {
        throw new Error(`Google Sheets responded with status: ${response.status}`);
      }

      const text = await response.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        const errMessage = 'Received non-JSON response from Google Sheets URL.';
        updateSyncState({ isSyncing: false, lastError: errMessage });
        return { success: false, message: errMessage };
      }

      // If the currently deployed script only returns the static router message
      if (data && data.status === 'active' && !data.leads && !data.venues && !data.campaigns) {
        const message = 'Webhook is active for sending data to Sheets! Paste the updated code from google-apps-script.js into your Google Sheet Apps Script to pull sheet updates into Admin.';
        updateSyncState({ isSyncing: false, lastError: message });
        return {
          success: false,
          probeOnly: true,
          message
        };
      }

      let leadsCount = 0;
      let venuesCount = 0;
      let campaignsCount = 0;

      if (data && typeof data === 'object') {
        if (Array.isArray(data.leads)) {
          const parsedLeads: AdminLead[] = data.leads.map((l: any, idx: number) => {
            const firstName = l['first name'] || l.firstname || l.firstName || '';
            const lastName = l['last name'] || l.lastname || l.lastName || '';
            const fullName = l.name || `${firstName} ${lastName}`.trim() || 'Inquiry';
            const rawFormType = l['form source'] || l.formsource || l['form type'] || l.formtype || l.FormType || '';
            const formType = normalizeSheetFormType(rawFormType);
            const company = l['company / business'] || l.companybusiness || l['company / brand'] || l.companybrand || l.company || l.Company || l.businessname || l['business name'] || '';
            const rawMessage = l['message / details'] || l.messagedetails || l['message details'] || l['message / goals'] || l.message || l.Message || l.goals || l['campaign goals / details'] || '';
            const subject = l.subject || l.Subject || '';

            return {
              id: l.leadid || l['Lead ID'] || l.id || l.ID || l.partnerid || l['Partner ID'] || l.subscriberid || l['Subscriber ID'] || l.inquiryid || l['Inquiry ID'] || `lead-sheet-${idx + 1}`,
              formType,
              name: fullName,
              email: l['work email'] || l.workemail || l.email || l.Email || '',
              company,
              phone: l.phone || l.Phone || '',
              subject,
              message: rawMessage,
              status: normalizeSheetLeadStatus(l.status || l.Status),
              priority: normalizeSheetPriority(l.priority || l.Priority),
              createdAt: l.timestamp || l.Timestamp || new Date().toISOString(),
              notes: l['internal notes'] || l.internalnotes || l.notes || l.Notes || '',
            };
          });

          adminDataService.mergeLeads(parsedLeads);
          leadsCount = parsedLeads.length;
        }

        if (Array.isArray(data.venues)) {
          const parsedVenues: AdminVenue[] = data.venues.map((v: any, idx: number) => ({
            id: v.id || v.ID || `ven-sheet-${idx + 1}`,
            name: v['venue name'] || v.venuename || v.name || v.Name || `Venue #${idx + 1}`,
            category: v.category || v.Category || 'Grocery & Supermarket',
            city: v.city || v.City || '',
            state: v.state || v.State || '',
            address: v['full address'] || v.fulladdress || v.address || v.Address || '',
            speakersCount: Number(v['speakers count'] || v.speakerscount || v.speakers || 16),
            monthlyFootfall: Number(v['monthly footfall'] || v.monthlyfootfall || v.footfall || 50000),
            status: (v.status || v.Status || 'online').toLowerCase(),
            partnerRevenueSharePct: Number(v['rev share %'] || v.revshare || v.partnerrevenuesharepct || 40),
            streamReceiverId: v['receiver hardware id'] || v.receiverhardwareid || v['receiver id'] || v.receiverid || v.streamreceiverid || `YEDZ-HW-${idx + 100}`,
            lastHeartbeat: 'Synced from Sheet',
            monthlyPlays: Number(v['monthly plays'] || v.monthlyplays || 0),
          }));
          adminDataService.mergeVenues(parsedVenues);
          venuesCount = parsedVenues.length;
        }

        if (Array.isArray(data.campaigns)) {
          const parsedCampaigns: AdminCampaign[] = data.campaigns.map((c: any, idx: number) => {
            const rawVenues = c['target venues'] || c.targetvenues || '';
            const targetVenues = Array.isArray(rawVenues) 
              ? rawVenues 
              : typeof rawVenues === 'string' && rawVenues ? rawVenues.split(',').map((s: string) => s.trim()) : ['Grocery & Supermarket'];

            return {
              id: c.id || c.ID || `camp-sheet-${idx + 1}`,
              title: c['campaign title'] || c.campaigntitle || c.title || c.Title || `Campaign #${idx + 1}`,
              client: c['client / brand'] || c.clientbrand || c.client || c.Client || 'Advertiser',
              clientEmail: c['client email'] || c.clientemail || '',
              audioUrl: c['audio creative url'] || c.audiocreativeurl || c['audio url'] || c.audiourl || '/advertisement.mp3',
              durationSeconds: Number(c['duration (s)'] || c.durationseconds || c.duration || 15),
              status: (c.status || c.Status || 'active').toLowerCase(),
              targetVenues,
              budget: Number(c['budget ($)'] || c.budget || 10000),
              spent: Number(c['spent ($)'] || c.spent || 0),
              impressionsTarget: Number(c['target impressions'] || c.impressionstarget || 500000),
              impressionsDelivered: Number(c['delivered impressions'] || c.impressionsdelivered || 0),
              startDate: c['start date'] || c.startdate || new Date().toISOString().slice(0, 10),
              endDate: c['end date'] || c.enddate || new Date().toISOString().slice(0, 10),
              cpm: Number(c['cpm ($)'] || c.cpm || 25.0),
            };
          });
          adminDataService.mergeCampaigns(parsedCampaigns);
          campaignsCount = parsedCampaigns.length;
        }

        updateSyncState({
          isSyncing: false,
          lastSyncedAt: new Date(),
          lastError: null,
          syncCount: syncState.syncCount + 1,
        });

        return {
          success: true,
          message: `Successfully synchronized from Google Sheets! (${leadsCount} leads, ${venuesCount} venues, ${campaignsCount} campaigns)`,
          counts: {
            leads: leadsCount,
            venues: venuesCount,
            campaigns: campaignsCount,
          }
        };
      }

      updateSyncState({ isSyncing: false, lastError: 'No table records found' });
      return {
        success: false,
        message: 'No table records found in Google Sheet.'
      };

    } catch (err) {
      console.error('Google Sheet fetch error:', err);
      const errMessage = err instanceof Error ? err.message : String(err);
      updateSyncState({ isSyncing: false, lastError: errMessage });
      return {
        success: false,
        message: errMessage
      };
    }
  },

  /**
   * Start periodic auto-sync polling in background
   */
  startAutoSync(intervalSeconds: number = 25): void {
    if (typeof window === 'undefined') return;

    // Immediately trigger a fetch on start
    this.fetchFromSheet().catch(() => {});

    // Clear existing timer if any
    if (autoSyncIntervalId !== null) {
      window.clearInterval(autoSyncIntervalId);
    }

    autoSyncIntervalId = window.setInterval(() => {
      // Only poll if tab is active/visible
      if (document.visibilityState === 'visible' && !syncState.isSyncing) {
        this.fetchFromSheet().catch(() => {});
      }
    }, Math.max(10, intervalSeconds) * 1000);

    // Also sync immediately when user switches back to this tab
    if (!isVisibilityBound) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !syncState.isSyncing) {
          this.fetchFromSheet().catch(() => {});
        }
      });
      isVisibilityBound = true;
    }
  },

  /**
   * Stop background polling
   */
  stopAutoSync(): void {
    if (autoSyncIntervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(autoSyncIntervalId);
      autoSyncIntervalId = null;
    }
  },

  /**
   * Push all current local data (leads, venues, campaigns) to Google Sheets
   */
  async pushAllToSheet(): Promise<boolean> {
    const leads = adminDataService.getLeads();
    const venues = adminDataService.getVenues();
    const campaigns = adminDataService.getCampaigns();

    return this.pushToSheet({
      action: 'bulkSync',
      timestamp: new Date().toISOString(),
      leads,
      venues,
      campaigns
    });
  },

  /**
   * Remove all dummy records from Google Sheets, leaving clean headers
   */
  async clearSheetsData(): Promise<boolean> {
    return this.pushToSheet({
      action: 'clearData',
      token: 'yedz_purge_auth_2026',
      timestamp: new Date().toISOString()
    });
  }
};
