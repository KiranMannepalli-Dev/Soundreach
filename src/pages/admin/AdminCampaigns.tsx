import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Edit3, 
  Trash2, 
  Target, 
  X, 
  CheckCircle2, 
  AlertCircle,
  LayoutGrid,
  List
} from 'lucide-react';
import { adminDataService, type AdminCampaign } from '../../services/adminDataService';

const VENUE_OPTIONS = [
  'Grocery & Supermarket',
  'Fitness Center',
  'Convenience Store',
  'Shopping Mall',
  'Gas Station & Plaza'
];

const DEFAULT_AUDIO_PRESETS = [
  { label: 'Standard Ad Spot (15s)', url: '/advertisement.mp3', duration: 15 },
  { label: 'Supermarket CTA Spot (30s)', url: '/cta_ad.mp3', duration: 30 },
  { label: 'High Energy Retail Spot (15s)', url: '/advertisers_ad.mp3', duration: 15 },
];

const getDefaultDates = () => {
  const start = new Date().toISOString().slice(0, 10);
  const end = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  return { start, end };
};

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>(() => adminDataService.getCampaigns());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'paused' | 'completed'>('all');
  const [venueFilter, setVenueFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals & Forms
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<AdminCampaign | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Playback Controller
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // New Campaign Form State
  const [formData, setFormData] = useState(() => {
    const { start, end } = getDefaultDates();
    return {
      title: '',
      client: '',
      clientEmail: '',
      audioUrl: '/advertisement.mp3',
      durationSeconds: 15,
      status: 'active' as AdminCampaign['status'],
      targetVenues: ['Grocery & Supermarket', 'Fitness Center'] as string[],
      budget: 25000,
      impressionsTarget: 1000000,
      startDate: start,
      endDate: end,
      cpm: 25.0,
    };
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshData = () => {
    setCampaigns(adminDataService.getCampaigns());
  };

  useEffect(() => {
    const handleDataChange = () => refreshData();
    window.addEventListener('yedz_admin_data_change', handleDataChange);
    return () => {
      window.removeEventListener('yedz_admin_data_change', handleDataChange);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // Audio Handler
  const togglePlayAudio = (campaignId: string, url: string) => {
    if (currentlyPlayingId === campaignId && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    } else {
      audioRef.current.pause();
      audioRef.current.src = url;
    }

    audioRef.current.play().catch(() => {});
    setCurrentlyPlayingId(campaignId);
    setIsPlaying(true);

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    };
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Filtered List
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      if (statusFilter !== 'all' && camp.status !== statusFilter) return false;
      if (venueFilter !== 'all' && !camp.targetVenues.includes(venueFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = camp.title.toLowerCase().includes(q);
        const matchClient = camp.client.toLowerCase().includes(q);
        const matchEmail = camp.clientEmail.toLowerCase().includes(q);
        if (!matchTitle && !matchClient && !matchEmail) return false;
      }
      return true;
    });
  }, [campaigns, statusFilter, venueFilter, searchQuery]);

  // Aggregate Metrics
  const campaignStats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === 'active').length;
    const totalDelivered = campaigns.reduce((acc, c) => acc + c.impressionsDelivered, 0);
    const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);
    return { total, active, totalDelivered, totalBudget };
  }, [campaigns]);

  // Quick Status Toggle
  const handleStatusChange = (id: string, newStatus: AdminCampaign['status']) => {
    adminDataService.updateCampaign(id, { status: newStatus });
    showToast(`Campaign status updated to ${newStatus}`);
  };

  // Save / Create Campaign
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.client.trim()) {
      alert('Please fill out the Campaign Title and Client name.');
      return;
    }

    const calculatedCpm = Number(((formData.budget / formData.impressionsTarget) * 1000).toFixed(2)) || 25.0;

    if (editingCampaign) {
      adminDataService.updateCampaign(editingCampaign.id, {
        title: formData.title.trim(),
        client: formData.client.trim(),
        clientEmail: formData.clientEmail.trim(),
        audioUrl: formData.audioUrl,
        durationSeconds: Number(formData.durationSeconds),
        status: formData.status,
        targetVenues: formData.targetVenues,
        budget: Number(formData.budget),
        impressionsTarget: Number(formData.impressionsTarget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        cpm: calculatedCpm,
      });
      showToast('Campaign successfully updated');
      setEditingCampaign(null);
    } else {
      adminDataService.addCampaign({
        title: formData.title.trim(),
        client: formData.client.trim(),
        clientEmail: formData.clientEmail.trim(),
        audioUrl: formData.audioUrl,
        durationSeconds: Number(formData.durationSeconds),
        status: formData.status,
        targetVenues: formData.targetVenues,
        budget: Number(formData.budget),
        impressionsTarget: Number(formData.impressionsTarget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        cpm: calculatedCpm,
      });
      showToast('New audio campaign created');
      setIsCreateModalOpen(false);
    }

    // Reset Form
    setFormData({
      title: '',
      client: '',
      clientEmail: '',
      audioUrl: '/advertisement.mp3',
      durationSeconds: 15,
      status: 'active',
      targetVenues: ['Grocery & Supermarket', 'Fitness Center'],
      budget: 25000,
      impressionsTarget: 1000000,
      startDate: getDefaultDates().start,
      endDate: getDefaultDates().end,
      cpm: 25.0,
    });
  };

  // Open Edit Modal
  const openEditModal = (camp: AdminCampaign) => {
    setEditingCampaign(camp);
    setFormData({
      title: camp.title,
      client: camp.client,
      clientEmail: camp.clientEmail,
      audioUrl: camp.audioUrl,
      durationSeconds: camp.durationSeconds,
      status: camp.status,
      targetVenues: camp.targetVenues,
      budget: camp.budget,
      impressionsTarget: camp.impressionsTarget,
      startDate: camp.startDate,
      endDate: camp.endDate,
      cpm: camp.cpm,
    });
    setIsCreateModalOpen(true);
  };

  // Delete Campaign
  const handleDelete = (id: string) => {
    if (currentlyPlayingId === id && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    }
    adminDataService.deleteCampaign(id);
    setDeleteConfirmId(null);
    showToast('Campaign removed');
  };

  const getStatusBadge = (status: AdminCampaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'paused':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'completed':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-5 pb-16">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-2.5 rounded-md shadow-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Audio Campaigns
          </h1>
          <p className="text-xs text-slate-500">
            Control in-store audio creatives, delivery pacing, target venues, and flight schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-md p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingCampaign(null);
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Launch Campaign</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">Total Campaigns</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{campaignStats.total}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">Live In Rotation</span>
          <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
            <span>{campaignStats.active} Active</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">Impressions Delivered</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {(campaignStats.totalDelivered / 1000000).toFixed(2)}M
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">Total Booked Budget</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ${campaignStats.totalBudget.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 sm:p-4 shadow-sm space-y-3">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {(['all', 'active', 'scheduled', 'paused', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search & Venue Category Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by campaign title, client, or email..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-red-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                &times;
              </button>
            )}
          </div>

          <div>
            <select
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-red-600 cursor-pointer"
            >
              <option value="all">All Target Venues</option>
              {VENUE_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* ================= VIEW MODE: CARDS (DEFAULT) ================= */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCampaigns.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-10 text-center text-slate-400">
              <VolumeX className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium text-sm text-slate-700 dark:text-slate-300">No audio campaigns found</p>
              <p className="text-xs mt-1 text-slate-500">Adjust your search filters or launch a new campaign spot.</p>
            </div>
          ) : (
            filteredCampaigns.map((camp) => {
              const pacingPct = Math.min(100, Math.round((camp.impressionsDelivered / camp.impressionsTarget) * 100));
              const isCurrentPlaying = currentlyPlayingId === camp.id && isPlaying;

              return (
                <div
                  key={camp.id}
                  className={`bg-white dark:bg-slate-900 border rounded-lg p-5 shadow-sm transition-all flex flex-col justify-between ${
                    isCurrentPlaying 
                      ? 'border-red-500 ring-1 ring-red-500/30' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top Bar: Title & Status */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-400">
                            #{camp.id}
                          </span>
                          <span className="text-xs text-slate-300 dark:text-slate-700">&bull;</span>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {camp.client}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5">
                          {camp.title}
                        </h3>
                      </div>

                      {/* Status Selector */}
                      <select
                        value={camp.status}
                        onChange={(e) => handleStatusChange(camp.id, e.target.value as AdminCampaign['status'])}
                        className={`text-xs font-medium px-2 py-1 rounded-md border capitalize cursor-pointer focus:outline-none ${getStatusBadge(camp.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Audio Spot Player Widget */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-md flex items-center justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => togglePlayAudio(camp.id, camp.audioUrl)}
                          className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            isCurrentPlaying ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                          }`}
                          title={isCurrentPlaying ? 'Pause Audio' : 'Preview In-Store Audio Spot'}
                        >
                          {isCurrentPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                        </button>

                        <div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Volume2 className="h-3.5 w-3.5 text-red-600" />
                            <span>{camp.durationSeconds}s Audio Spot</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-[220px]">
                            {camp.audioUrl}
                          </div>
                        </div>
                      </div>

                      {isCurrentPlaying && (
                        <div className="flex items-end gap-[2px] h-3.5 pr-1">
                          <div className="w-[2.5px] bg-red-600 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite_alternate]"></div>
                          <div className="w-[2.5px] bg-red-600 rounded-full animate-[soundwave_1.1s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-[2.5px] bg-red-600 rounded-full animate-[soundwave_0.9s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      )}
                    </div>

                    {/* Pacing Bar */}
                    <div className="space-y-1 mb-3.5">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>
                          Pacing: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{(camp.impressionsDelivered / 1000).toLocaleString()}k</strong> / {(camp.impressionsTarget / 1000).toLocaleString()}k imps
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{pacingPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full transition-all duration-500" style={{ width: `${pacingPct}%` }}></div>
                      </div>
                    </div>

                    {/* Target Channels */}
                    <div className="mb-3.5">
                      <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                        <Target className="h-3 w-3 text-red-600" /> Target Channels:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {camp.targetVenues.map((v) => (
                          <span
                            key={v}
                            className="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Budget & Flight Period */}
                    <div className="grid grid-cols-2 gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-md text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Spend / Budget</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          ${camp.spent.toLocaleString()} / ${camp.budget.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Flight Period</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {camp.startDate} &rarr; {camp.endDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      CPM: <strong className="text-slate-800 dark:text-slate-200 font-semibold">${camp.cpm.toFixed(2)}</strong>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(camp)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        title="Edit Campaign"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(camp.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                        title="Delete Campaign"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ================= VIEW MODE: TABLE ================= */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Campaign & Client</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Pacing</th>
                  <th className="py-3 px-4">Budget / CPM</th>
                  <th className="py-3 px-4">Flight Dates</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No campaigns created yet. Click "Launch Campaign" or sync from Google Sheets.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((camp) => {
                  const pacingPct = Math.min(100, Math.round((camp.impressionsDelivered / camp.impressionsTarget) * 100));
                  const isCurrentPlaying = currentlyPlayingId === camp.id && isPlaying;

                  return (
                    <tr key={camp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => togglePlayAudio(camp.id, camp.audioUrl)}
                          className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            isCurrentPlaying ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {isCurrentPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{camp.title}</div>
                        <div className="text-slate-500 text-[11px]">{camp.client} &bull; {camp.durationSeconds}s spot</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-medium capitalize px-2 py-0.5 rounded-full border ${getStatusBadge(camp.status)}`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{pacingPct}%</div>
                        <div className="text-[11px] text-slate-400">{((camp.impressionsDelivered)/1000).toLocaleString()}k imps</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">${camp.budget.toLocaleString()}</div>
                        <div className="text-[11px] text-slate-400">${camp.cpm.toFixed(2)} CPM</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {camp.startDate} &rarr; {camp.endDate}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditModal(camp)} className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(camp.id)} className="p-1 text-slate-400 hover:text-red-600">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= CREATE / EDIT CAMPAIGN MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsCreateModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col z-10 overflow-hidden">
            
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingCampaign ? `Edit Campaign: ${editingCampaign.title}` : 'Launch Audio Campaign'}
                </h2>
                <p className="text-xs text-slate-500">
                  {editingCampaign ? 'Update broadcast delivery parameters' : 'Schedule a new audio commercial across store network'}
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Campaign Title & Client */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. PureHydro Electrolyte Blast"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Advertiser Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. PureHydro Beverage Corp"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Client Email & Status */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Client Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="campaigns@purehydro.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Broadcast Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminCampaign['status'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="active">Active (Broadcasting)</option>
                    <option value="scheduled">Scheduled (Future)</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Audio Creative Asset Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Audio Creative Spot Preset
                </label>
                <div className="grid sm:grid-cols-3 gap-2 mb-2">
                  {DEFAULT_AUDIO_PRESETS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setFormData({ ...formData, audioUrl: preset.url, durationSeconds: preset.duration })}
                      className={`p-2 rounded-md text-left border text-xs transition-colors cursor-pointer ${
                        formData.audioUrl === preset.url
                          ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div>{preset.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{preset.url}</div>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  placeholder="Or enter custom audio URL: /advertisement.mp3"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 font-mono text-[11px]"
                />
              </div>

              {/* Target Venues Checkboxes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Target In-Store Channels
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {VENUE_OPTIONS.map((venue) => {
                    const isChecked = formData.targetVenues.includes(venue);
                    return (
                      <button
                        key={venue}
                        type="button"
                        onClick={() => {
                          const updated = isChecked 
                            ? formData.targetVenues.filter((v) => v !== venue)
                            : [...formData.targetVenues, venue];
                          setFormData({ ...formData, targetVenues: updated });
                        }}
                        className={`p-1.5 rounded-md text-left border text-xs transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-medium'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {venue}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget, Impressions Target & Calculated CPM */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Impressions
                  </label>
                  <input
                    type="number"
                    min="50000"
                    step="50000"
                    required
                    value={formData.impressionsTarget}
                    onChange={(e) => setFormData({ ...formData, impressionsTarget: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Calculated CPM
                  </label>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    ${formData.impressionsTarget > 0 ? ((formData.budget / formData.impressionsTarget) * 1000).toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Flight Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Flight End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  {editingCampaign ? 'Save Changes' : 'Launch Campaign'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />

          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-5 max-w-sm w-full z-10 text-center space-y-3">
            <div className="h-10 w-10 bg-red-50 text-red-600 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete Audio Campaign?</h3>
            <p className="text-xs text-slate-500">
              This will remove this audio campaign from rotation across network streaming hardware.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Audio Playing Indicator Bar */}
      {isPlaying && currentlyPlayingId && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 sm:px-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-end gap-[2px] h-3.5">
              <div className="w-[2.5px] bg-red-600 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite_alternate]"></div>
              <div className="w-[2.5px] bg-red-600 rounded-full animate-[soundwave_1.1s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-[2.5px] bg-red-600 rounded-full animate-[soundwave_0.9s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="text-xs">
              <span className="font-medium text-slate-500">Previewing spot: </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {campaigns.find((c) => c.id === currentlyPlayingId)?.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                audioRef.current?.pause();
                setIsPlaying(false);
                setCurrentlyPlayingId(null);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
