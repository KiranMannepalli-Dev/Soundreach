import { sheetSyncService } from './sheetSyncService';

export interface AdminLead {
  id: string;
  formType: 'Advertisers Page Lead' | 'Retail Partner Inquiry' | 'Contact Page Inquiry' | 'Newsletter Subscription' | string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  locationsCount?: string;
  businessType?: string;
  subject?: string;
  message?: string;
  goals?: string;
  status: 'new' | 'contacted' | 'negotiating' | 'converted' | 'archived';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  notes?: string;
}

export interface AdminCampaign {
  id: string;
  title: string;
  client: string;
  clientEmail: string;
  audioUrl: string;
  durationSeconds: number;
  status: 'active' | 'scheduled' | 'paused' | 'completed';
  targetVenues: string[];
  budget: number;
  spent: number;
  impressionsTarget: number;
  impressionsDelivered: number;
  startDate: string;
  endDate: string;
  cpm: number;
}

export interface AdminVenue {
  id: string;
  name: string;
  category: 'Grocery & Supermarket' | 'Fitness Center' | 'Convenience Store' | 'Shopping Mall' | 'Gas Station & Plaza' | string;
  city: string;
  state: string;
  address: string;
  speakersCount: number;
  monthlyFootfall: number;
  status: 'online' | 'offline' | 'maintenance';
  partnerRevenueSharePct: number;
  streamReceiverId: string;
  lastHeartbeat: string;
  monthlyPlays: number;
}

const STORAGE_KEYS = {
  LEADS: 'yedz_admin_leads_v2',
  CAMPAIGNS: 'yedz_admin_campaigns_v2',
  VENUES: 'yedz_admin_venues_v2',
};

// Clean up legacy v1 mock keys so no old dummy data lingers in browser
try {
  localStorage.removeItem('yedz_admin_leads_v1');
  localStorage.removeItem('yedz_admin_campaigns_v1');
  localStorage.removeItem('yedz_admin_venues_v1');
} catch {
  // Ignore in non-browser environments
}

// Listen for cross-tab storage changes (e.g. form submission in another tab)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
      window.dispatchEvent(new Event('yedz_admin_data_change'));
    }
  });
}

// Zero dummy data by default
const INITIAL_LEADS: AdminLead[] = [];
const INITIAL_CAMPAIGNS: AdminCampaign[] = [];
const INITIAL_VENUES: AdminVenue[] = [];

// Helper to get or init storage
function getStored<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('yedz_admin_data_change'));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

export const adminDataService = {
  /* ==================== LEADS CRUD ==================== */
  getLeads(): AdminLead[] {
    return getStored<AdminLead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
  },

  setLeads(leads: AdminLead[]): void {
    setStored(STORAGE_KEYS.LEADS, leads);
  },

  /**
   * Smart merge remote leads from Google Sheets with local leads.
   * Preserves recent locally created leads that may still be in transit,
   * updates existing entries, and deduplicates.
   */
  mergeLeads(remoteLeads: AdminLead[]): AdminLead[] {
    const localLeads = this.getLeads();
    const mergedMap = new Map<string, AdminLead>();

    // 1. Add all remote leads from Google Sheets
    remoteLeads.forEach((rl) => {
      const key = rl.id || `${rl.email}_${rl.createdAt}`;
      mergedMap.set(key, rl);
    });

    // 2. Preserve local leads that aren't in remote yet (submitted recently)
    const now = Date.now();
    localLeads.forEach((ll) => {
      // Check if an equivalent remote lead already exists (by id or by email+formType)
      const exactMatch = mergedMap.has(ll.id);
      const emailMatch = Array.from(mergedMap.values()).find(
        (rl) => rl.email && rl.email.toLowerCase() === ll.email.toLowerCase() && rl.formType === ll.formType
      );

      if (!exactMatch && !emailMatch) {
        // Keep local lead if it was created within the last 24 hours
        const leadAgeMs = now - new Date(ll.createdAt).getTime();
        if (isNaN(leadAgeMs) || leadAgeMs < 24 * 60 * 60 * 1000) {
          mergedMap.set(ll.id, ll);
        }
      }
    });

    const result = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setStored(STORAGE_KEYS.LEADS, result);
    return result;
  },

  /**
   * Smart merge remote venues from Google Sheets with local venues
   */
  mergeVenues(remoteVenues: AdminVenue[]): AdminVenue[] {
    if (!remoteVenues || remoteVenues.length === 0) return this.getVenues();
    setStored(STORAGE_KEYS.VENUES, remoteVenues);
    return remoteVenues;
  },

  /**
   * Smart merge remote campaigns from Google Sheets with local campaigns
   */
  mergeCampaigns(remoteCampaigns: AdminCampaign[]): AdminCampaign[] {
    if (!remoteCampaigns || remoteCampaigns.length === 0) return this.getCampaigns();
    setStored(STORAGE_KEYS.CAMPAIGNS, remoteCampaigns);
    return remoteCampaigns;
  },

  addLead(lead: Omit<AdminLead, 'id' | 'createdAt'>, skipRemoteSync: boolean = false): AdminLead {
    const leads = this.getLeads();
    const newLead: AdminLead = {
      ...lead,
      id: `lead-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.LEADS, [newLead, ...leads]);

    // Push to Google Sheets in background if not skipped
    if (!skipRemoteSync) {
      sheetSyncService.pushToSheet({
        action: 'lead',
        event: 'create',
        ...newLead
      }).catch(() => {});
    }

    return newLead;
  },

  updateLead(id: string, updates: Partial<AdminLead>, skipRemoteSync: boolean = false): AdminLead | null {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;
    leads[index] = { ...leads[index], ...updates };
    setStored(STORAGE_KEYS.LEADS, leads);

    // Push to Google Sheets in background if not skipped
    if (!skipRemoteSync) {
      sheetSyncService.pushToSheet({
        action: 'lead',
        event: 'update',
        id,
        ...updates
      }).catch(() => {});
    }

    return leads[index];
  },

  deleteLead(id: string, skipRemoteSync: boolean = false): boolean {
    const leads = this.getLeads();
    const target = leads.find((l) => l.id === id);
    const filtered = leads.filter((l) => l.id !== id);
    setStored(STORAGE_KEYS.LEADS, filtered);

    // Push deletion to Google Sheets in background if not skipped
    if (!skipRemoteSync) {
      sheetSyncService.pushToSheet({
        action: 'lead',
        event: 'delete',
        id,
        email: target?.email || ''
      }).catch(() => {});
    }

    return filtered.length !== leads.length;
  },

  /* ==================== CAMPAIGNS CRUD ==================== */
  getCampaigns(): AdminCampaign[] {
    return getStored<AdminCampaign[]>(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  },

  setCampaigns(campaigns: AdminCampaign[]): void {
    setStored(STORAGE_KEYS.CAMPAIGNS, campaigns);
  },

  addCampaign(campaign: Omit<AdminCampaign, 'id' | 'impressionsDelivered' | 'spent'>, skipRemoteSync: boolean = false): AdminCampaign {
    const campaigns = this.getCampaigns();
    const newCamp: AdminCampaign = {
      ...campaign,
      id: `camp-${Date.now().toString().slice(-4)}`,
      impressionsDelivered: 0,
      spent: 0,
    };
    setStored(STORAGE_KEYS.CAMPAIGNS, [newCamp, ...campaigns]);

    // Push to Google Sheets in background if not skipped
    if (!skipRemoteSync) {
      sheetSyncService.pushToSheet({
        action: 'campaign',
        event: 'create',
        ...newCamp
      }).catch(() => {});
    }

    return newCamp;
  },

  updateCampaign(id: string, updates: Partial<AdminCampaign>, skipRemoteSync: boolean = false): AdminCampaign | null {
    const campaigns = this.getCampaigns();
    const index = campaigns.findIndex((c) => c.id === id);
    if (index === -1) return null;
    campaigns[index] = { ...campaigns[index], ...updates };
    setStored(STORAGE_KEYS.CAMPAIGNS, campaigns);

    // Push to Google Sheets in background if not skipped
    if (!skipRemoteSync) {
      sheetSyncService.pushToSheet({
        action: 'campaign',
        event: 'update',
        id,
        ...updates
      }).catch(() => {});
    }

    return campaigns[index];
  },

  deleteCampaign(id: string, skipRemoteSync: boolean = false): boolean {
    const campaigns = this.getCampaigns();
    const target = campaigns.find((c) => c.id === id);
    const filtered = campaigns.filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.CAMPAIGNS, filtered);

    // Push deletion to Google Sheets in background if not skipped
    if (!skipRemoteSync) {
      sheetSyncService.pushToSheet({
        action: 'campaign',
        event: 'delete',
        id,
        title: target?.title || ''
      }).catch(() => {});
    }

    return filtered.length !== campaigns.length;
  },

  /* ==================== VENUES CRUD ==================== */
  getVenues(): AdminVenue[] {
    return getStored<AdminVenue[]>(STORAGE_KEYS.VENUES, INITIAL_VENUES);
  },

  setVenues(venues: AdminVenue[]): void {
    setStored(STORAGE_KEYS.VENUES, venues);
  },

  addVenue(venue: Omit<AdminVenue, 'id' | 'lastHeartbeat' | 'monthlyPlays'>, skipRemoteSync: boolean = false): AdminVenue {
    const venues = this.getVenues();
    const newVenue: AdminVenue = {
      ...venue,
      id: `ven-${Date.now().toString().slice(-4)}`,
      lastHeartbeat: 'Just now',
      monthlyPlays: 0,
    };
    setStored(STORAGE_KEYS.VENUES, [newVenue, ...venues]);

    // Push to Google Sheets in background if not skipped
    if (!skipRemoteSync) {
      sheetSyncService.pushToSheet({
        action: 'venue',
        event: 'create',
        ...newVenue
      }).catch(() => {});
    }

    return newVenue;
  },

  updateVenue(id: string, updates: Partial<AdminVenue>, skipRemoteSync: boolean = false): AdminVenue | null {
    const venues = this.getVenues();
    const index = venues.findIndex((v) => v.id === id);
    if (index === -1) return null;
    venues[index] = { ...venues[index], ...updates };
    setStored(STORAGE_KEYS.VENUES, venues);

    // Push to Google Sheets in background if not skipped
    if (!skipRemoteSync) {
      sheetSyncService.pushToSheet({
        action: 'venue',
        event: 'update',
        id,
        ...updates
      }).catch(() => {});
    }

    return venues[index];
  },

  deleteVenue(id: string, skipRemoteSync: boolean = false): boolean {
    const venues = this.getVenues();
    const target = venues.find((v) => v.id === id);
    const filtered = venues.filter((v) => v.id !== id);
    setStored(STORAGE_KEYS.VENUES, filtered);

    // Push deletion to Google Sheets in background if not skipped
    if (!skipRemoteSync) {
      sheetSyncService.pushToSheet({
        action: 'venue',
        event: 'delete',
        id,
        name: target?.name || ''
      }).catch(() => {});
    }

    return filtered.length !== venues.length;
  },

  /* ==================== DYNAMIC WEBSITE STATS ==================== */
  getNetworkStats() {
    const venues = this.getVenues();
    const totalVenues = venues.length;
    const onlineVenues = venues.filter((v) => v.status === 'online').length;
    const totalSpeakers = venues.reduce((acc, v) => acc + (Number(v.speakersCount) || 0), 0);
    const totalFootfall = venues.reduce((acc, v) => acc + (Number(v.monthlyFootfall) || 0), 0);
    const totalPlays = venues.reduce((acc, v) => acc + (Number(v.monthlyPlays) || 0), 0);

    const categoryCounts: Record<string, number> = {
      'Grocery & Supermarket': 0,
      'Fitness Center': 0,
      'Convenience Store': 0,
      'Shopping Mall': 0,
      'Gas Station & Plaza': 0,
    };

    venues.forEach((v) => {
      if (categoryCounts[v.category] !== undefined) {
        categoryCounts[v.category]++;
      } else {
        categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
      }
    });

    const reachDisplay = totalFootfall > 0 
      ? (totalFootfall >= 1_000_000 ? `${(totalFootfall / 1_000_000).toFixed(1)}M+` : `${Math.round(totalFootfall / 1_000)}k+`)
      : '0';

    return {
      totalVenues,
      onlineVenues,
      totalSpeakers,
      totalFootfall,
      totalPlays,
      categoryCounts,
      reachDisplay,
      hasVenues: totalVenues > 0,
    };
  },

  /* ==================== REACTIVE SUBSCRIPTION HELPER ==================== */
  subscribe(listener: () => void): () => void {
    const handler = () => listener();
    window.addEventListener('yedz_admin_data_change', handler);
    return () => window.removeEventListener('yedz_admin_data_change', handler);
  },

  /* ==================== AGGREGATE STATS FOR ADMIN ==================== */
  getOverviewMetrics() {
    const leads = this.getLeads();
    const campaigns = this.getCampaigns();
    const venues = this.getVenues();

    const activeCampaigns = campaigns.filter((c) => c.status === 'active');
    const onlineVenues = venues.filter((v) => v.status === 'online');

    const totalImpressions = campaigns.reduce((acc, c) => acc + (Number(c.impressionsDelivered) || 0), 0);
    const totalRevenue = campaigns.reduce((acc, c) => acc + (Number(c.spent) || 0), 0);
    const totalSpeakers = venues.reduce((acc, v) => acc + (Number(v.speakersCount) || 0), 0);
    const totalFootfall = venues.reduce((acc, v) => acc + (Number(v.monthlyFootfall) || 0), 0);
    const newLeadsCount = leads.filter((l) => l.status === 'new').length;

    return {
      totalLeads: leads.length,
      newLeadsCount,
      activeCampaignsCount: activeCampaigns.length,
      totalCampaignsCount: campaigns.length,
      onlineVenuesCount: onlineVenues.length,
      totalVenuesCount: venues.length,
      totalSpeakers,
      totalFootfall,
      totalImpressions,
      totalRevenue,
    };
  },

  // Clear all data (zero state)
  clearAllData() {
    setStored(STORAGE_KEYS.LEADS, []);
    setStored(STORAGE_KEYS.CAMPAIGNS, []);
    setStored(STORAGE_KEYS.VENUES, []);
    window.dispatchEvent(new Event('yedz_admin_data_change'));
  },

  // Alias for backward compatibility
  resetAllData() {
    this.clearAllData();
  },
};
