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

export const sheetSyncService = {
  getWebhookUrl(): string {
    return getSheetsWebhookUrl();
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
      // Using no-cors: Google Apps Script POST always redirects (302→200),
      // which browsers block under CORS. no-cors sends as opaque request —
      // data still reaches and is recorded by Apps Script.
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
      return { success: false, message: 'No Google Sheets webhook URL configured in .env' };
    }

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
        return {
          success: false,
          message: 'Received non-JSON response from Google Sheets URL.'
        };
      }

      // If the currently deployed script only returns the static router message
      if (data && data.status === 'active' && !data.leads && !data.venues && !data.campaigns) {
        return {
          success: false,
          probeOnly: true,
          message: 'Webhook is active for sending data to Sheets! To pull sheet updates into Admin, paste the updated code from google-apps-script.js into your Google Sheet Apps Script.'
        };
      }

      // If full multi-tab data was returned
      let leadsCount = 0;
      let venuesCount = 0;
      let campaignsCount = 0;

      if (data && typeof data === 'object') {
        if (Array.isArray(data.leads) && data.leads.length > 0) {
          const parsedLeads: AdminLead[] = data.leads.map((l: any, idx: number) => ({
            id: l.leadid || l['Lead ID'] || l.id || l.ID || l.partnerid || l['Partner ID'] || l.subscriberid || l['Subscriber ID'] || l.inquiryid || l['Inquiry ID'] || `lead-sheet-${idx + 1}`,
            formType: l['form source'] || l.formsource || l['form type'] || l.formtype || l.FormType || 'Website Lead',
            name: l.name || `${l['first name'] || l.firstname || ''} ${l['last name'] || l.lastname || ''}`.trim() || 'Inquiry',
            email: l['work email'] || l.workemail || l.email || l.Email || '',
            company: l['company / business'] || l.companybusiness || l.company || l.Company || l.businessname || '',
            phone: l.phone || l.Phone || '',
            subject: l.subject || l.Subject || '',
            message: l['message / details'] || l.messagedetails || l['message / goals'] || l.message || l.Message || l.goals || '',
            status: (l.status || l.Status || 'new').toLowerCase(),
            priority: (l.priority || l.Priority || 'medium').toLowerCase(),
            createdAt: l.timestamp || l.Timestamp || new Date().toISOString(),
            notes: l.notes || l.Notes || '',
          }));
          adminDataService.setLeads(parsedLeads);
          leadsCount = parsedLeads.length;
        }

        if (Array.isArray(data.venues) && data.venues.length > 0) {
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
          adminDataService.setVenues(parsedVenues);
          venuesCount = parsedVenues.length;
        }

        if (Array.isArray(data.campaigns) && data.campaigns.length > 0) {
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
          adminDataService.setCampaigns(parsedCampaigns);
          campaignsCount = parsedCampaigns.length;
        }

        return {
          success: true,
          message: `Successfully synchronized from Google Sheets!`,
          counts: {
            leads: leadsCount,
            venues: venuesCount,
            campaigns: campaignsCount,
          }
        };
      }

      return {
        success: false,
        message: 'No table records found in Google Sheet.'
      };

    } catch (err) {
      console.error('Google Sheet fetch error:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : String(err)
      };
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
      timestamp: new Date().toISOString()
    });
  }
};
