import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Radio, 
  Store, 
  Play, 
  Pause, 
  Volume2, 
  ArrowRight,
  DollarSign,
  Plus,
  RefreshCw
} from 'lucide-react';
import { adminDataService, type AdminLead, type AdminCampaign, type AdminVenue } from '../../services/adminDataService';
import { sheetSyncService } from '../../services/sheetSyncService';

export default function AdminOverview() {
  const [metrics, setMetrics] = useState(() => adminDataService.getOverviewMetrics());
  const [recentLeads, setRecentLeads] = useState<AdminLead[]>(() => adminDataService.getLeads().slice(0, 5));
  const [activeCampaigns, setActiveCampaigns] = useState<AdminCampaign[]>(() => adminDataService.getCampaigns().slice(0, 3));
  const [venues, setVenues] = useState<AdminVenue[]>(() => adminDataService.getVenues().slice(0, 4));
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioInstance] = useState(() => new Audio('/advertisement.mp3'));
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleDataChange = () => {
      setMetrics(adminDataService.getOverviewMetrics());
      setRecentLeads(adminDataService.getLeads().slice(0, 5));
      setActiveCampaigns(adminDataService.getCampaigns().slice(0, 3));
      setVenues(adminDataService.getVenues().slice(0, 4));
    };

    window.addEventListener('yedz_admin_data_change', handleDataChange);
    return () => {
      window.removeEventListener('yedz_admin_data_change', handleDataChange);
      audioInstance.pause();
    };
  }, [audioInstance]);

  const toggleStreamPreview = () => {
    if (isPlayingAudio) {
      audioInstance.pause();
      setIsPlayingAudio(false);
    } else {
      audioInstance.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  const handleSyncFromSheets = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    const res = await sheetSyncService.fetchFromSheet();
    setIsSyncing(false);
    setSyncStatus(res.message);
    setTimeout(() => setSyncStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Live</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Command Center Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management for audio campaigns, customer leads, and venue streaming hardware.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sync with Google Sheets Button */}
          <button
            onClick={handleSyncFromSheets}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Pull latest data updates from Google Sheets"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync with Sheets'}</span>
          </button>

          {/* Live Audio Test Player */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-md p-2 sm:px-3">
            <div className="text-left">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Volume2 className="h-3 w-3 text-red-600" />
                <span>Audio Stream</span>
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {isPlayingAudio ? 'Broadcasting test...' : 'Standby'}
              </div>
            </div>
            <button
              onClick={toggleStreamPreview}
              className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isPlayingAudio ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
              }`}
              title={isPlayingAudio ? 'Pause Test Stream' : 'Play Test Stream'}
            >
              {isPlayingAudio ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-md flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <Link 
          to="/admin/leads"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors block"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Inquiries</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalLeads}</div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-500">
            <span className="text-red-600 font-semibold">{metrics.newLeadsCount} new leads</span>
            <span>Manage &rarr;</span>
          </div>
        </Link>

        {/* Metric 2 */}
        <Link 
          to="/admin/campaigns"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors block"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Campaigns</span>
            <Radio className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.activeCampaignsCount}</div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-500">
            <span className="text-emerald-600 font-semibold">
              {metrics.totalImpressions > 0 ? `${(metrics.totalImpressions / 1000).toLocaleString()}k delivered` : '0 imps delivered'}
            </span>
            <span>View &rarr;</span>
          </div>
        </Link>

        {/* Metric 3 */}
        <Link 
          to="/admin/venues"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors block"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Store Network</span>
            <Store className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalVenuesCount}</div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-500">
            <span className="text-blue-600 font-semibold">{metrics.onlineVenuesCount} online now</span>
            <span>Directory &rarr;</span>
          </div>
        </Link>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Revenue Booked</span>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ${metrics.totalRevenue.toLocaleString()}
          </div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-500">
            <span className="text-slate-600 dark:text-slate-400 font-medium">{metrics.totalSpeakers} speakers</span>
            <span>Live Sync</span>
          </div>
        </div>

      </div>

      {/* Two Columns: Recent Leads & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Inquiries */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Inquiries</h2>
                <p className="text-xs text-slate-500">Incoming submissions from storefront forms</p>
              </div>
              <Link to="/admin/leads" className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Users className="h-6 w-6 mx-auto mb-1.5 opacity-40" />
                <p className="font-medium text-slate-600 dark:text-slate-400">No customer inquiries yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Form submissions from the website and Google Sheets will appear here dynamically.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{lead.name}</div>
                      <div className="text-slate-500 text-[11px]">
                        {lead.company && `${lead.company} • `}{lead.email}
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                      lead.status === 'new' 
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' 
                        : lead.status === 'negotiating'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/admin/leads"
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 flex items-center justify-center gap-1 py-1"
            >
              <span>Manage all inquiries &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Audio Campaigns Pacing */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Campaign Pacing</h2>
                <p className="text-xs text-slate-500">Live in-store audio spot rotation</p>
              </div>
              <Link to="/admin/campaigns" className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {activeCampaigns.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Radio className="h-6 w-6 mx-auto mb-1.5 opacity-40" />
                <p className="font-medium text-slate-600 dark:text-slate-400">No active audio campaigns</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click Launch Campaign to schedule your first audio commercial.</p>
                <Link
                  to="/admin/campaigns"
                  className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium"
                >
                  <Plus className="h-3 w-3" />
                  <span>Launch Campaign</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCampaigns.map((camp) => {
                  const pct = Math.min(100, Math.round(((camp.impressionsDelivered || 0) / (camp.impressionsTarget || 1)) * 100));
                  return (
                    <div key={camp.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-md space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-900 dark:text-white">{camp.title}</div>
                        <span className="text-[10px] font-medium text-emerald-600 uppercase">{camp.status}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>{camp.client}</span>
                        <span>{pct}% ({((camp.impressionsDelivered || 0)/1000).toFixed(0)}k imps)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/admin/campaigns"
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 flex items-center justify-center gap-1 py-1"
            >
              <span>Manage campaign schedules &rarr;</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Hardware Receivers Snapshot */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Network Hardware Receivers</h2>
            <p className="text-xs text-slate-500">Telemetry status across retail locations</p>
          </div>
          <Link to="/admin/venues" className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
            <span>Explore Store Network</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {venues.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <Store className="h-6 w-6 mx-auto mb-1.5 opacity-40" />
            <p className="font-medium text-slate-600 dark:text-slate-400">No physical venues registered yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Register a store location in the Venues tab or sync from Google Sheets.</p>
            <Link
              to="/admin/venues"
              className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-medium"
            >
              <Plus className="h-3 w-3" />
              <span>Register Store</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {venues.map((venue) => (
              <div key={venue.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-md flex flex-col justify-between text-xs space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400 font-medium">{venue.category}</span>
                    <span className={`h-2 w-2 rounded-full ${venue.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white truncate">{venue.name}</div>
                  <div className="text-[11px] text-slate-500">{venue.city}, {venue.state}</div>
                </div>

                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{venue.speakersCount} speakers</span>
                  <span className="font-medium text-emerald-600">{venue.monthlyPlays.toLocaleString()} plays</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
