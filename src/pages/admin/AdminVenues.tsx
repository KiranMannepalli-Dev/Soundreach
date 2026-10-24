import { useState, useEffect, useMemo } from 'react';
import { 
  Store, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Radio, 
  MapPin, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Download,
  LayoutGrid, 
  List,
  Activity
} from 'lucide-react';
import { adminDataService, type AdminVenue } from '../../services/adminDataService';

const VENUE_CATEGORIES: AdminVenue['category'][] = [
  'Grocery & Supermarket',
  'Fitness Center',
  'Convenience Store',
  'Shopping Mall',
  'Gas Station & Plaza'
];

const createDefaultVenueForm = () => ({
  name: '',
  category: 'Grocery & Supermarket' as AdminVenue['category'],
  city: '',
  state: '',
  address: '',
  speakersCount: 16,
  monthlyFootfall: 75000,
  status: 'online' as AdminVenue['status'],
  partnerRevenueSharePct: 40,
  streamReceiverId: 'YEDZ-HW-8820',
});

export default function AdminVenues() {
  const [venues, setVenues] = useState<AdminVenue[]>(() => adminDataService.getVenues());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'maintenance'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals & State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<AdminVenue | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState(() => createDefaultVenueForm());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshData = () => {
    setVenues(adminDataService.getVenues());
  };

  useEffect(() => {
    const handleDataChange = () => refreshData();
    window.addEventListener('yedz_admin_data_change', handleDataChange);
    return () => window.removeEventListener('yedz_admin_data_change', handleDataChange);
  }, []);

  // Filtered Venues
  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchCity = v.city.toLowerCase().includes(q);
        const matchState = v.state.toLowerCase().includes(q);
        const matchAddress = v.address.toLowerCase().includes(q);
        const matchId = v.streamReceiverId.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchState && !matchAddress && !matchId) return false;
      }
      return true;
    });
  }, [venues, statusFilter, categoryFilter, searchQuery]);

  // Network Telemetry Metrics
  const telemetry = useMemo(() => {
    const total = venues.length;
    const online = venues.filter((v) => v.status === 'online').length;
    const totalSpeakers = venues.reduce((acc, v) => acc + v.speakersCount, 0);
    const totalFootfall = venues.reduce((acc, v) => acc + v.monthlyFootfall, 0);
    const totalPlays = venues.reduce((acc, v) => acc + v.monthlyPlays, 0);
    return { total, online, totalSpeakers, totalFootfall, totalPlays };
  }, [venues]);

  // Quick Hardware Status Toggle
  const handleStatusChange = (id: string, newStatus: AdminVenue['status']) => {
    adminDataService.updateVenue(id, { status: newStatus });
    showToast(`Hardware status updated to ${newStatus}`);
  };

  // Hardware Ping simulation
  const handlePingHardware = (id: string) => {
    adminDataService.updateVenue(id, { 
      status: 'online',
      lastHeartbeat: 'Just now' 
    });
    showToast('Ping packet received from receiver');
  };

  // Save / Add Venue
  const handleSaveVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim() || !formData.state.trim()) {
      alert('Please fill out the Venue Name, City, and State.');
      return;
    }

    if (editingVenue) {
      adminDataService.updateVenue(editingVenue.id, {
        name: formData.name.trim(),
        category: formData.category,
        city: formData.city.trim(),
        state: formData.state.trim(),
        address: formData.address.trim(),
        speakersCount: Number(formData.speakersCount),
        monthlyFootfall: Number(formData.monthlyFootfall),
        status: formData.status,
        partnerRevenueSharePct: Number(formData.partnerRevenueSharePct),
        streamReceiverId: formData.streamReceiverId.trim(),
      });
      showToast('Venue parameters updated');
      setEditingVenue(null);
    } else {
      adminDataService.addVenue({
        name: formData.name.trim(),
        category: formData.category,
        city: formData.city.trim(),
        state: formData.state.trim(),
        address: formData.address.trim(),
        speakersCount: Number(formData.speakersCount),
        monthlyFootfall: Number(formData.monthlyFootfall),
        status: formData.status,
        partnerRevenueSharePct: Number(formData.partnerRevenueSharePct),
        streamReceiverId: formData.streamReceiverId.trim() || `YEDZ-HW-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      showToast('New retail venue registered');
      setIsModalOpen(false);
    }

    // Reset Form
    setFormData(createDefaultVenueForm());
  };

  // Open Edit Modal
  const openEditModal = (venue: AdminVenue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      category: venue.category,
      city: venue.city,
      state: venue.state,
      address: venue.address,
      speakersCount: venue.speakersCount,
      monthlyFootfall: venue.monthlyFootfall,
      status: venue.status,
      partnerRevenueSharePct: venue.partnerRevenueSharePct,
      streamReceiverId: venue.streamReceiverId,
    });
    setIsModalOpen(true);
  };

  // Delete Venue
  const handleDelete = (id: string) => {
    adminDataService.deleteVenue(id);
    setDeleteConfirmId(null);
    showToast('Venue location unregistered');
  };

  // Export Venues to CSV
  const handleExportCSV = () => {
    if (filteredVenues.length === 0) {
      alert('No venues matching current filters.');
      return;
    }

    const headers = ['ID', 'Venue Name', 'Category', 'Address', 'City', 'State', 'Speakers', 'Monthly Footfall', 'Status', 'Rev Share %', 'Receiver ID', 'Monthly Plays'];
    const rows = filteredVenues.map((v) => [
      v.id,
      `"${v.name.replace(/"/g, '""')}"`,
      `"${v.category}"`,
      `"${v.address.replace(/"/g, '""')}"`,
      `"${v.city}"`,
      v.state,
      v.speakersCount,
      v.monthlyFootfall,
      v.status,
      `${v.partnerRevenueSharePct}%`,
      v.streamReceiverId,
      v.monthlyPlays,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `venues_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Venues CSV exported');
  };

  const getStatusBadge = (status: AdminVenue['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'maintenance':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'offline':
        return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800';
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
            Retail Venues & Store Network
          </h1>
          <p className="text-xs text-slate-500">
            Telemetry and receiver hardware management for {venues.length} registered {venues.length === 1 ? 'venue' : 'venues'}
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
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingVenue(null);
              setFormData(createDefaultVenueForm());
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Register Store</span>
          </button>
        </div>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">Network Footprint</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{venues.length} {venues.length === 1 ? 'Venue' : 'Venues'}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">Hardware Receivers</span>
          <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
            <span>{telemetry.online} Online</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">Speakers Under Management</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {telemetry.totalSpeakers} Units
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block mb-1">Monthly In-Store Plays</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {telemetry.totalPlays.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 sm:p-4 shadow-sm space-y-3">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Categories
          </button>
          {VENUE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Status Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by store name, city, state, or receiver ID (e.g. YEDZ-HW-8812)..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full sm:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-red-600 cursor-pointer"
            >
              <option value="all">All Telemetry Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

      </div>

      {/* ================= VIEW MODE: CARDS (DEFAULT) ================= */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVenues.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-10 text-center text-slate-400">
              <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium text-sm text-slate-700 dark:text-slate-300">No venue locations match criteria</p>
              <p className="text-xs mt-1 text-slate-500">Adjust search parameters or register a new retail venue.</p>
            </div>
          ) : (
            filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-2.5">
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {venue.category}
                    </span>

                    {/* Status Toggle Dropdown */}
                    <select
                      value={venue.status}
                      onChange={(e) => handleStatusChange(venue.id, e.target.value as AdminVenue['status'])}
                      className={`text-xs font-medium px-2 py-0.5 rounded-md border capitalize cursor-pointer focus:outline-none ${getStatusBadge(venue.status)}`}
                    >
                      <option value="online">Online</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>

                  {/* Venue Name & Location */}
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {venue.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{venue.address}, {venue.city}, {venue.state}</span>
                  </div>

                  {/* Hardware Telemetry Box */}
                  <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-md space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Radio className="h-3.5 w-3.5 text-red-600" />
                        {venue.streamReceiverId}
                      </span>
                      <button
                        onClick={() => handlePingHardware(venue.id)}
                        className="text-[11px] font-medium text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        title="Ping receiver hardware"
                      >
                        <Activity className="h-3 w-3" />
                        <span>Ping</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span>Heartbeat: {venue.lastHeartbeat}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{venue.monthlyPlays.toLocaleString()} plays</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Speakers</span>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">{venue.speakersCount}</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Footfall</span>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">{(venue.monthlyFootfall / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Rev Share</span>
                      <span className="font-semibold text-xs text-red-600">{venue.partnerRevenueSharePct}%</span>
                    </div>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    #{venue.id}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(venue)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      title="Edit Venue Parameters"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(venue.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
                      title="Unregister Store"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      ) : (
        /* ================= VIEW MODE: TABLE ================= */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Venue & Address</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Hardware Receiver</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Speakers</th>
                  <th className="py-3 px-4">Footfall</th>
                  <th className="py-3 px-4">Rev Share</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredVenues.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No retail venues registered yet. Click "Register Store" or sync from Google Sheets.
                    </td>
                  </tr>
                ) : (
                  filteredVenues.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{v.name}</div>
                      <div className="text-slate-500 text-[11px]">{v.address}, {v.city}, {v.state}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {v.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-xs text-red-600">
                      {v.streamReceiverId}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-medium capitalize px-2 py-0.5 rounded-full border ${getStatusBadge(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{v.speakersCount} units</td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{v.monthlyFootfall.toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-red-600">{v.partnerRevenueSharePct}%</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEditModal(v)} className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirmId(v.id)} className="p-1 text-slate-400 hover:text-red-600 cursor-pointer">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= REGISTER / EDIT VENUE MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col z-10 overflow-hidden">
            
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingVenue ? `Edit Venue: ${editingVenue.name}` : 'Register Retail Store'}
                </h2>
                <p className="text-xs text-slate-500">
                  {editingVenue ? 'Update hardware telemetry and store details' : 'Add a new location to the audio ad network'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVenue} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Store / Venue Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. FreshMarket Superstore #205"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 font-medium"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Channel Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AdminVenue['category'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    {VENUE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Telemetry Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminVenue['status'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="online">Online (Streaming Active)</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 1024 Broadway St"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Chicago"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. IL"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Speakers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    required
                    value={formData.speakersCount}
                    onChange={(e) => setFormData({ ...formData, speakersCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Footfall / Month
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    required
                    value={formData.monthlyFootfall}
                    onChange={(e) => setFormData({ ...formData, monthlyFootfall: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Rev Share %
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="80"
                    required
                    value={formData.partnerRevenueSharePct}
                    onChange={(e) => setFormData({ ...formData, partnerRevenueSharePct: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 font-medium text-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Receiver Hardware ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.streamReceiverId}
                  onChange={(e) => setFormData({ ...formData, streamReceiverId: e.target.value })}
                  placeholder="YEDZ-HW-8812"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 font-mono text-xs uppercase"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  {editingVenue ? 'Save Changes' : 'Register Store'}
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
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Unregister Venue?</h3>
            <p className="text-xs text-slate-500">
              This will remove this venue from the programmatic audio streaming rotation.
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

    </div>
  );
}
