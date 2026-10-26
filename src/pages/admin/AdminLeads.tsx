import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Trash2, 
  Eye, 
  X, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  FileSpreadsheet,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { adminDataService, type AdminLead } from '../../services/adminDataService';
import { sheetSyncService } from '../../services/sheetSyncService';

type StatusFilter = 'all' | 'new' | 'contacted' | 'negotiating' | 'converted' | 'archived';

export default function AdminLeads() {
  const [leads, setLeads] = useState<AdminLead[]>(() => adminDataService.getLeads());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isSyncingSheets, setIsSyncingSheets] = useState(() => sheetSyncService.getSyncState().isSyncing);
  
  // Modals
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    formType: 'Advertisers Page Lead' as AdminLead['formType'],
    priority: 'medium' as AdminLead['priority'],
    status: 'new' as AdminLead['status'],
    message: '',
    goals: '',
    notes: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshLeads = () => {
    setLeads(adminDataService.getLeads());
  };

  useEffect(() => {
    const handleDataChange = () => refreshLeads();
    window.addEventListener('yedz_admin_data_change', handleDataChange);
    return () => window.removeEventListener('yedz_admin_data_change', handleDataChange);
  }, []);

  // Fetch latest data from Google Sheets when opening Leads page
  useEffect(() => {
    let isMounted = true;
    sheetSyncService.fetchFromSheet().finally(() => {
      if (isMounted) {
        setIsSyncingSheets(false);
        refreshLeads();
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSyncFromSheets = async () => {
    setIsSyncingSheets(true);
    const res = await sheetSyncService.fetchFromSheet();
    setIsSyncingSheets(false);
    refreshLeads();
    showToast(res.message);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (typeFilter !== 'all' && lead.formType !== typeFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = lead.name?.toLowerCase().includes(query);
        const matchEmail = lead.email?.toLowerCase().includes(query);
        const matchCompany = lead.company?.toLowerCase().includes(query);
        const matchMessage = lead.message?.toLowerCase().includes(query);
        const matchGoals = lead.goals?.toLowerCase().includes(query);
        const matchNotes = lead.notes?.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchCompany && !matchMessage && !matchGoals && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [leads, statusFilter, typeFilter, searchQuery]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { all: leads.length, new: 0, contacted: 0, negotiating: 0, converted: 0, archived: 0 };
    leads.forEach((l) => {
      if (counts[l.status] !== undefined) counts[l.status]++;
    });
    return counts;
  }, [leads]);

  const handleStatusChange = (id: string, newStatus: AdminLead['status']) => {
    adminDataService.updateLead(id, { status: newStatus });
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Status updated to ${newStatus}`);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.email.trim()) {
      alert('Please provide name and email.');
      return;
    }

    adminDataService.addLead({
      name: newLeadForm.name.trim(),
      email: newLeadForm.email.trim(),
      company: newLeadForm.company.trim() || undefined,
      phone: newLeadForm.phone.trim() || undefined,
      formType: newLeadForm.formType,
      priority: newLeadForm.priority,
      status: newLeadForm.status,
      message: newLeadForm.message.trim() || undefined,
      goals: newLeadForm.goals.trim() || undefined,
      notes: newLeadForm.notes.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setNewLeadForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      formType: 'Advertisers Page Lead',
      priority: 'medium',
      status: 'new',
      message: '',
      goals: '',
      notes: '',
    });
    showToast('Lead added successfully!');
  };

  const handleDelete = (id: string) => {
    adminDataService.deleteLead(id);
    if (selectedLead?.id === id) setSelectedLead(null);
    setDeleteConfirmId(null);
    showToast('Lead deleted');
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      alert('No leads to export.');
      return;
    }

    const safeCsvCell = (val: string | number | undefined | null) => {
      let str = String(val ?? '');
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = ['ID', 'Date', 'Name', 'Email', 'Company', 'Phone', 'Source', 'Status', 'Priority', 'Message', 'Notes'];
    const rows = filteredLeads.map((l) => [
      safeCsvCell(l.id),
      safeCsvCell(new Date(l.createdAt).toLocaleDateString()),
      safeCsvCell(l.name),
      safeCsvCell(l.email),
      safeCsvCell(l.company),
      safeCsvCell(l.phone),
      safeCsvCell(l.formType),
      safeCsvCell(l.status),
      safeCsvCell(l.priority),
      safeCsvCell(l.goals || l.message),
      safeCsvCell(l.notes),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded');
  };

  return (
    <div className="space-y-5">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-2.5 rounded-md shadow-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Leads & Inquiries
          </h1>
          <p className="text-xs text-slate-500">
            Review and track incoming customer submissions from your website forms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncFromSheets}
            disabled={isSyncingSheets}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            title="Pull latest submissions from Google Sheets"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-500 ${isSyncingSheets ? 'animate-spin' : ''}`} />
            <span>{isSyncingSheets ? 'Syncing...' : 'Sync with Sheets'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 sm:p-4 shadow-sm space-y-3">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(['all', 'new', 'contacted', 'negotiating', 'converted', 'archived'] as StatusFilter[]).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span>{st}</span>
              <span className="ml-1.5 text-[10px] opacity-75">
                ({statusCounts[st]})
              </span>
            </button>
          ))}
        </div>

        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, email..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="Advertisers Page Lead">Advertisers Page</option>
            <option value="Retail Partner Inquiry">Retail Partner Form</option>
            <option value="Contact Page Inquiry">Contact Form</option>
            <option value="Newsletter Subscription">Newsletter</option>
          </select>
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    <FileSpreadsheet className="h-6 w-6 mx-auto mb-1.5 text-slate-400" />
                    <p className="font-medium text-xs text-slate-700 dark:text-slate-300">No leads or customer inquiries yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Website form submissions and rows from Google Sheets will appear here automatically.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{lead.name}</div>
                      <div className="text-slate-500 text-[11px]">
                        {lead.company && <span className="font-medium text-slate-700 dark:text-slate-300">{lead.company} &bull; </span>}
                        {lead.email}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                        lead.formType.includes('Contact')
                          ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800'
                          : lead.formType.includes('Advertiser')
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                          : lead.formType.includes('Partner') || lead.formType.includes('Retail')
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : lead.formType.includes('Newsletter')
                          ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}>
                        {lead.formType.replace(' Page Lead', '').replace(' Page Inquiry', '').replace(' Inquiry', '').replace(' Subscription', '')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded capitalize ${
                        lead.priority === 'high'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          : lead.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {lead.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as AdminLead['status'])}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded cursor-pointer border ${
                          lead.status === 'new'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
                            : lead.status === 'negotiating'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                            : lead.status === 'contacted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
                            : lead.status === 'converted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="negotiating">Negotiating</option>
                        <option value="converted">Converted</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(lead.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>{filteredLeads.length} leads listed</span>
          <span>Auto-saved to store</span>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col z-10 overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Lead #{selectedLead.id}</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedLead.name}</h2>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as AdminLead['status'])}
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="converted">Converted</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Priority:</span>
                  <select
                    value={selectedLead.priority}
                    onChange={(e) => {
                      const newP = e.target.value as AdminLead['priority'];
                      adminDataService.updateLead(selectedLead.id, { priority: newP });
                      setSelectedLead({ ...selectedLead, priority: newP });
                      showToast(`Priority set to ${newP}`);
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </span>
                  <a href={`mailto:${selectedLead.email}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600 block">
                    {selectedLead.email}
                  </a>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Company
                  </span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedLead.company || 'Not specified'}
                  </div>
                </div>

                {selectedLead.phone && (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </span>
                    <a href={`tel:${selectedLead.phone}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600 block">
                      {selectedLead.phone}
                    </a>
                  </div>
                )}

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Received
                  </span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {new Date(selectedLead.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {selectedLead.subject && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500">Subject</span>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs">
                    {selectedLead.subject}
                  </div>
                </div>
              )}

              {(selectedLead.goals || selectedLead.message) && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500">Inquiry Message / Campaign Scope</span>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedLead.goals || selectedLead.message}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">Operator Follow-up Notes</span>
                <textarea
                  defaultValue={selectedLead.notes || ''}
                  onBlur={(e) => {
                    const newNotes = e.target.value;
                    adminDataService.updateLead(selectedLead.id, { notes: newNotes });
                    setSelectedLead({ ...selectedLead, notes: newNotes });
                    showToast('Notes saved');
                  }}
                  rows={2}
                  placeholder="Add notes from phone calls or client discussions..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setDeleteConfirmId(selectedLead.id)}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedLead.email}?subject=YedZ Media inquiry follow up`}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md shadow-sm"
                >
                  Email Client
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-md"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col z-10 overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Add Manual Lead</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Email *</label>
                  <input
                    type="email"
                    required
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Company</label>
                  <input
                    type="text"
                    value={newLeadForm.company}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Source</label>
                  <select
                    value={newLeadForm.formType}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, formType: e.target.value as AdminLead['formType'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white"
                  >
                    <option value="Advertisers Page Lead">Advertiser</option>
                    <option value="Retail Partner Inquiry">Retail Partner</option>
                    <option value="Contact Page Inquiry">Contact Form</option>
                    <option value="Newsletter Subscription">Newsletter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Status</label>
                  <select
                    value={newLeadForm.status}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value as AdminLead['status'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Priority</label>
                  <select
                    value={newLeadForm.priority}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, priority: e.target.value as AdminLead['priority'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Notes</label>
                <textarea
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-5 max-w-sm w-full z-10 text-center space-y-3">
            <AlertCircle className="h-6 w-6 text-red-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete Lead Entry?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently delete this lead?
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
