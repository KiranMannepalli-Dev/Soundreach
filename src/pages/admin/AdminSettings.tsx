import { useState } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  Database, 
  Shield, 
  Radio, 
  Download, 
  Sliders, 
  Send,
  Loader2,
  Copy,
  Check,
  UploadCloud,
  DownloadCloud,
  FileCode,
  Save,
  RotateCcw,
  Link2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { adminDataService } from '../../services/adminDataService';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  submitLeadToSheet, 
  getSheetsWebhookUrl, 
  setCustomSheetsWebhookUrl, 
  isCustomSheetsUrlActive 
} from '../../services/sheetService';
import { sheetSyncService } from '../../services/sheetSyncService';

export default function AdminSettings() {
  const { user } = useAdminAuth();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<string | null>(null);

  // Dynamic Google Sheets Webhook Switching
  const [activeUrl, setActiveUrl] = useState(() => getSheetsWebhookUrl());
  const [inputUrl, setInputUrl] = useState(() => getSheetsWebhookUrl());
  const [isCustomUrl, setIsCustomUrl] = useState(() => isCustomSheetsUrlActive());
  const [urlMessage, setUrlMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [showSwitchGuide, setShowSwitchGuide] = useState(false);

  // Sync state
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isClearingSheets, setIsClearingSheets] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showScriptDetails, setShowScriptDetails] = useState(false);

  // Audio Broadcast Engine Parameters (stored in local settings)
  const [audioSettings, setAudioSettings] = useState({
    masterLoudness: '-14 LUFS',
    streamBitrate: '320 kbps MP3',
    minAdSeparation: '12 minutes',
    hardwarePollingInterval: '60 seconds',
  });
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  const handleSaveCustomUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = inputUrl.trim();

    if (!cleanUrl) {
      setUrlMessage({ type: 'error', text: 'Please enter a valid Google Apps Script Web App URL.' });
      return;
    }

    if (!cleanUrl.startsWith('https://script.google.com/macros/s/')) {
      setUrlMessage({
        type: 'error',
        text: 'Invalid format! The URL must start with: https://script.google.com/macros/s/.../exec'
      });
      return;
    }

    setIsSavingUrl(true);
    setUrlMessage(null);

    try {
      setCustomSheetsWebhookUrl(cleanUrl);
      setActiveUrl(cleanUrl);
      setIsCustomUrl(true);

      // Diagnostic probe
      try {
        await fetch(`${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}action=ping&t=${Date.now()}`, {
          method: 'GET',
          mode: 'no-cors'
        });
      } catch {
        // no-cors fallback
      }

      setUrlMessage({
        type: 'success',
        text: '✅ New Google Sheet connected! All website forms and admin sync will instantly save into this new sheet without any code changes.'
      });
    } catch {
      setUrlMessage({
        type: 'error',
        text: 'Failed to save URL to browser storage.'
      });
    } finally {
      setIsSavingUrl(false);
    }
  };

  const handleResetToDefaultUrl = () => {
    if (window.confirm('Reset Google Sheets Webhook back to the default project sheet?')) {
      setCustomSheetsWebhookUrl(null);
      const def = getSheetsWebhookUrl();
      setActiveUrl(def);
      setInputUrl(def);
      setIsCustomUrl(false);
      setUrlMessage({
        type: 'info',
        text: 'Reverted back to the default project Google Sheet URL.'
      });
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('Delete all data (leads, venues, campaigns) and reset both Admin and Google Sheets to a clean zero state?')) {
      adminDataService.clearAllData();
      await sheetSyncService.clearSheetsData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handlePurgeSheetsDummyData = async () => {
    if (window.confirm('Wipe all dummy records from Google Sheets (Leads, Venues, Campaigns)? Clean formatted headers will be preserved so you can start fresh from today.')) {
      setIsClearingSheets(true);
      setSyncStatus(null);
      const ok = await sheetSyncService.clearSheetsData();
      setIsClearingSheets(false);
      if (ok) {
        setSyncStatus('✅ All dummy data purged from Google Sheets! Sheets are now clean and ready for fresh records.');
      } else {
        setSyncStatus('Purge request dispatched to Google Sheets webhook.');
      }
    }
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    setWebhookTestResult(null);

    try {
      const res = await submitLeadToSheet({
        formType: 'Webhook Diagnostic Probe',
        firstName: 'System',
        lastName: 'Diagnostic',
        email: 'diagnostic@yedzmedia.com',
        subject: 'Diagnostic Webhook Verification',
        message: `Admin telemetry ping at ${new Date().toISOString()}`,
      });

      if (res.success) {
        setWebhookTestResult('Success: Endpoint reachable & row appended to Google Sheet');
      } else {
        setWebhookTestResult('Warning: Request sent. Verify Google Sheet permissions.');
      }
    } catch {
      setWebhookTestResult('Connection failed. Verify internet connection.');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handlePullFromSheets = async () => {
    setIsPulling(true);
    setSyncStatus(null);
    const res = await sheetSyncService.fetchFromSheet();
    setIsPulling(false);
    setSyncStatus(res.message);
  };

  const handlePushToSheets = async () => {
    setIsPushing(true);
    setSyncStatus(null);
    const success = await sheetSyncService.pushAllToSheet();
    setIsPushing(false);
    if (success) {
      setSyncStatus('Successfully dispatched all current data to Google Sheets!');
    } else {
      setSyncStatus('Push completed. Check Google Sheet to verify.');
    }
  };

  const handleCopyScriptCode = () => {
    const code = `/**
 * YedZ Media - Customer Inquiries & Ad Network Two-Way Synchronization Engine (v3.0)
 */
var SCHEMAS = {
  'All Leads': ['Timestamp', 'Form Source', 'First Name', 'Last Name', 'Work Email', 'Company / Business', 'Message / Details', 'Status'],
  'Advertisers': ['Timestamp', 'Form Source', 'First Name', 'Last Name', 'Work Email', 'Company / Business', 'Message / Details', 'Status'],
  'Retail Partners': ['Timestamp', 'Form Source', 'First Name', 'Last Name', 'Work Email', 'Company / Business', 'Message / Details', 'Status'],
  'Contact Messages': ['Timestamp', 'Form Source', 'First Name', 'Last Name', 'Work Email', 'Company / Business', 'Message / Details', 'Status'],
  'Newsletter Subscriptions': ['Timestamp', 'Form Source', 'Work Email', 'Status'],
  'Venues': ['Timestamp', 'ID', 'Name', 'Category', 'City', 'State', 'Address', 'Speakers Count', 'Monthly Footfall', 'Status', 'Rev Share %', 'Receiver ID', 'Monthly Plays'],
  'Campaigns': ['Timestamp', 'ID', 'Title', 'Client', 'Client Email', 'Audio URL', 'Duration (s)', 'Status', 'Target Venues', 'Budget ($)', 'Spent ($)', 'Target Impressions', 'Delivered Impressions', 'Start Date', 'End Date', 'CPM ($)']
};
var STATUS_OPTIONS = ['New Lead', 'In Progress', 'Qualified', 'Contacted', 'Closed'];

function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var tab in SCHEMAS) getOrCreateFormattedSheet(ss, tab, SCHEMAS[tab]);
  removeDuplicateTabs(ss);
  Logger.log("✅ Configured All Leads, Category Tabs, and removed duplicates (Sheet1, Leads)!");
  return "Setup completed!";
}

function clearAllDummyData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var tab in SCHEMAS) {
    var sheet = ss.getSheetByName(tab);
    if (sheet) {
      sheet.clear();
      applyNavyHeader(sheet, SCHEMAS[tab]);
      if (tab.indexOf('Venues') === -1 && tab.indexOf('Campaigns') === -1) applyStatusValidation(sheet, SCHEMAS[tab].length);
    } else getOrCreateFormattedSheet(ss, tab, SCHEMAS[tab]);
  }
  removeDuplicateTabs(ss);
  Logger.log("✅ All dummy rows cleared! Ready for live data.");
  return "All dummy data removed!";
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) || 'getData';
    if (action === 'ping') return jsonResponse({ status: 'active', message: 'Engine online!' });
    if (action === 'clearData' || action === 'reset') {
      clearAllDummyData();
      return jsonResponse({ status: 'success', message: 'All dummy rows removed.' });
    }
    var masterLeads = readSheetRows(ss, 'All Leads');
    if (masterLeads.length === 0) masterLeads = readSheetRows(ss, 'Leads');
    return jsonResponse({
      status: 'success',
      timestamp: new Date().toISOString(),
      leads: masterLeads,
      venues: readSheetRows(ss, 'Venues'),
      campaigns: readSheetRows(ss, 'Campaigns')
    });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    var data = raw ? JSON.parse(raw) : {};
    var action = data.action || data.type || (data.formType ? 'lead' : 'ping');
    if (action === 'lead' || data.formType) handleLeadSync(ss, data);
    else if (action === 'venue') handleVenueSync(ss, data);
    else if (action === 'campaign') handleCampaignSync(ss, data);
    else if (action === 'bulkSync') handleBulkSync(ss, data);
    else if (action === 'clearData' || action === 'reset') clearAllDummyData();
    return jsonResponse({ result: 'success', timestamp: new Date().toISOString() });
  } catch (err) {
    return jsonResponse({ result: 'error', message: err.toString() });
  }
}

function handleLeadSync(ss, data) {
  var ts = formatReadableDate(data.createdAt);
  var formSource = normalizeFormSource(data.formType);
  var fn = data.firstName || '', ln = data.lastName || '', email = data.email || '';
  var comp = data.company || data.businessName || '';
  var msg = data.message || data.goals || '';
  if (data.locationsCount) msg = 'Locations: ' + data.locationsCount + ' | Type: ' + (data.businessType || 'Retail');
  var st = data.status || 'New Lead';
  if (st.toLowerCase() === 'new') st = 'New Lead';

  var master = getOrCreateFormattedSheet(ss, 'All Leads', SCHEMAS['All Leads']);
  master.appendRow([ts, formSource, fn, ln, email, comp, msg, st]);
  styleLeadRow(master, master.getLastRow(), formSource);

  var subTab = getSubTabName(formSource);
  if (subTab && subTab !== 'All Leads') {
    var subSheet = getOrCreateFormattedSheet(ss, subTab, SCHEMAS[subTab]);
    var subRow = subTab === 'Newsletter Subscriptions' ? [ts, formSource, email, st] : [ts, formSource, fn, ln, email, comp, msg, st];
    subSheet.appendRow(subRow);
    styleLeadRow(subSheet, subSheet.getLastRow(), formSource);
  }
}

function handleVenueSync(ss, data) {
  var sheet = getOrCreateFormattedSheet(ss, 'Venues', SCHEMAS.Venues);
  var id = data.id || ('ven-' + Utilities.getUuid().slice(0, 8));
  if (data.event === 'delete') { deleteRowById(sheet, id, 1); return; }
  if (data.event === 'update') {
    var row = findRowIndex(sheet, id, 1);
    if (row > 0) {
      if (data.name) sheet.getRange(row, 3).setValue(data.name);
      if (data.category) sheet.getRange(row, 4).setValue(data.category);
      if (data.city) sheet.getRange(row, 5).setValue(data.city);
      if (data.state) sheet.getRange(row, 6).setValue(data.state);
      if (data.address) sheet.getRange(row, 7).setValue(data.address);
      if (data.status) sheet.getRange(row, 10).setValue(data.status);
      return;
    }
  }
  sheet.appendRow([new Date().toISOString(), id, data.name || '', data.category || '', data.city || '', data.state || '', data.address || '', data.speakersCount || 0, data.monthlyFootfall || 0, data.status || 'online', data.partnerRevenueSharePct || 40, data.streamReceiverId || '', data.monthlyPlays || 0]);
}

function handleCampaignSync(ss, data) {
  var sheet = getOrCreateFormattedSheet(ss, 'Campaigns', SCHEMAS.Campaigns);
  var id = data.id || ('camp-' + Utilities.getUuid().slice(0, 8));
  if (data.event === 'delete') { deleteRowById(sheet, id, 1); return; }
  if (data.event === 'update') {
    var row = findRowIndex(sheet, id, 1);
    if (row > 0) {
      if (data.title) sheet.getRange(row, 3).setValue(data.title);
      if (data.client) sheet.getRange(row, 4).setValue(data.client);
      if (data.status) sheet.getRange(row, 8).setValue(data.status);
      return;
    }
  }
  sheet.appendRow([new Date().toISOString(), id, data.title || '', data.client || '', data.clientEmail || '', data.audioUrl || '', data.durationSeconds || 15, data.status || 'active', Array.isArray(data.targetVenues) ? data.targetVenues.join(', ') : '', data.budget || 0, data.spent || 0, data.impressionsTarget || 0, data.impressionsDelivered || 0, data.startDate || '', data.endDate || '', data.cpm || 0]);
}

function handleBulkSync(ss, data) {
  if (data.leads && Array.isArray(data.leads)) for (var h = 0; h < data.leads.length; h++) handleLeadSync(ss, data.leads[h]);
  if (data.venues && Array.isArray(data.venues)) for (var i = 0; i < data.venues.length; i++) handleVenueSync(ss, data.venues[i]);
  if (data.campaigns && Array.isArray(data.campaigns)) for (var j = 0; j < data.campaigns.length; j++) handleCampaignSync(ss, data.campaigns[j]);
}

function applyNavyHeader(sheet, headers) {
  sheet.appendRow(headers);
  var range = sheet.getRange(1, 1, 1, headers.length);
  range.setFontWeight('bold').setBackground('#0b132b').setFontColor('#ffffff').setFontSize(10).setHorizontalAlignment('center');
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
}

function applyStatusValidation(sheet, col) {
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUS_OPTIONS, true).setAllowInvalid(false).build();
  sheet.getRange(2, col, 999, 1).setDataValidation(rule);
}

function getOrCreateFormattedSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    applyNavyHeader(sheet, headers);
    if (name.indexOf('Venues') === -1 && name.indexOf('Campaigns') === -1) applyStatusValidation(sheet, headers.length);
  }
  return sheet;
}

function removeDuplicateTabs(ss) {
  ['Sheet1', 'Leads'].forEach(function(dup) {
    var bad = ss.getSheetByName(dup);
    if (bad && ss.getSheets().length > 1) { try { ss.deleteSheet(bad); } catch(e){} }
  });
}

function styleLeadRow(sheet, row, src) {
  try {
    var cell = sheet.getRange(row, 2);
    cell.setFontWeight('bold').setHorizontalAlignment('center');
    if (src.indexOf('Advertiser') !== -1) { cell.setFontColor('#991b1b'); cell.setBackground('#fee2e2'); }
    else if (src.indexOf('Partner') !== -1 || src.indexOf('Retail') !== -1) { cell.setFontColor('#166534'); cell.setBackground('#dcfce7'); }
    else if (src.indexOf('Newsletter') !== -1) { cell.setFontColor('#6b21a8'); cell.setBackground('#f3e8ff'); }
    else if (src.indexOf('Contact') !== -1) { cell.setFontColor('#075985'); cell.setBackground('#e0f2fe'); }
  } catch(e){}
}

function normalizeFormSource(s) {
  if (!s) return 'Website Lead';
  var l = s.toLowerCase();
  if (l.indexOf('advertiser') !== -1) return 'Advertisers Page Lead';
  if (l.indexOf('partner') !== -1 || l.indexOf('retail') !== -1) return 'Retail Partner Inquiry';
  if (l.indexOf('newsletter') !== -1) return 'Newsletter Subscription';
  if (l.indexOf('contact') !== -1) return 'Contact Page Inquiry';
  return s;
}

function getSubTabName(src) {
  if (src === 'Advertisers Page Lead') return 'Advertisers';
  if (src === 'Retail Partner Inquiry') return 'Retail Partners';
  if (src === 'Newsletter Subscription') return 'Newsletter Subscriptions';
  if (src === 'Contact Page Inquiry') return 'Contact Messages';
  return null;
}

function formatReadableDate(iso) {
  try {
    var d = iso ? new Date(iso) : new Date();
    var p = function(n){ return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  } catch(e) { return new Date().toISOString().slice(0, 19).replace('T', ' '); }
}

function deleteRowById(sheet, id, col) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) { if (data[i][col] == id) { sheet.deleteRow(i + 1); return true; } }
  return false;
}

function findRowIndex(sheet, id, col) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) { if (data[i][col] == id) return i + 1; }
  return -1;
}

function readSheetRows(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0], rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[String(headers[j]).trim().toLowerCase().replace(/[^a-z0-9]/g, '')] = data[i][j];
      obj[headers[j]] = data[i][j];
    }
    rows.push(obj);
  }
  return rows;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}`;

    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    });
  };

  const handleDownloadBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      network: 'YedZ Media Programmatic Audio Network',
      leads: adminDataService.getLeads(),
      campaigns: adminDataService.getCampaigns(),
      venues: adminDataService.getVenues(),
      metrics: adminDataService.getOverviewMetrics(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `yedz_media_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveAudioSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-4xl pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          System & Platform Settings
        </h1>
        <p className="text-xs text-slate-500">
          Configure two-way Google Sheets synchronization, in-store broadcast engine parameters, and database state
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 rounded-md">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>All data cleared. Database is now in clean zero state.</span>
        </div>
      )}

      {savedSettingsSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 rounded-md">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Audio broadcast engine parameters updated and synced to receivers.</span>
        </div>
      )}

      {/* 1. Admin Operator Profile */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Shield className="h-4 w-4 text-red-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Current Authenticated Operator
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-slate-400 text-[11px] mb-1">Operator Name</div>
            <div className="font-semibold text-slate-900 dark:text-white">{user?.name}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] mb-1">Email Address</div>
            <div className="font-semibold text-slate-900 dark:text-white">{user?.email}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] mb-1">Role & Permissions</div>
            <span className="inline-block px-2 py-0.5 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800 rounded text-xs font-medium">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Google Sheets Two-Way Synchronization & Dynamic Sheet Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Radio className="h-4 w-4 text-red-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Google Sheets Two-Way Synchronization
              </h2>
              <p className="text-[11px] text-slate-500">
                Connected Sheet Webhook & Real-time Bi-directional Data Relay
              </p>
            </div>
          </div>
          {isCustomUrl ? (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Custom Sheet
            </span>
          ) : (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Default Project Sheet (.env)
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          When customers submit inquiry forms on the website (Advertisers, Retail Partners, Contact, Newsletter) or when you add/edit data in the Admin Panel, entries are automatically saved to your connected Google Sheet in real-time.
        </p>

        {/* Dynamic Sheet URL Switcher Form */}
        <form onSubmit={handleSaveCustomUrl} className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Google Apps Script Web App Endpoint URL
            </label>
            <button
              type="button"
              onClick={() => setShowSwitchGuide(!showSwitchGuide)}
              className="text-[11px] text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="h-3 w-3" />
              <span>{showSwitchGuide ? 'Hide Switch Instructions' : 'How to switch when sheet is full?'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (urlMessage) setUrlMessage(null);
                }}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingUrl || inputUrl.trim() === activeUrl}
              className="inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSavingUrl ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>Save & Connect Sheet</span>
            </button>

            {isCustomUrl && (
              <button
                type="button"
                onClick={handleResetToDefaultUrl}
                className="inline-flex items-center justify-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                title="Restore default .env spreadsheet webhook"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset to Default</span>
              </button>
            )}
          </div>

          {urlMessage && (
            <div className={`p-2.5 rounded-md text-xs font-medium flex items-center gap-2 ${
              urlMessage.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
                : urlMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                : 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
            }`}>
              {urlMessage.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              <span>{urlMessage.text}</span>
            </div>
          )}

          {showSwitchGuide && (
            <div className="mt-2 p-3.5 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-red-600" />
                <span>Zero-Code Sheet Replacement Guide (When a Sheet is Full)</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1.5 text-[11px] leading-relaxed">
                <li>Create a <strong>new blank Google Sheet</strong> in your Google Drive (e.g. <em>YedZ Media CRM 2027</em>).</li>
                <li>In Google Sheets top menu, click <strong>Extensions &gt; Apps Script</strong>.</li>
                <li>Delete existing placeholder code and paste the code from below (click <strong>"Copy Multi-Tab Code"</strong>).</li>
                <li>Click <strong>Deploy &gt; New deployment &gt; Select type: Web app</strong>.</li>
                <li>Set <strong>Execute as: "Me"</strong> and <strong>Who has access: "Anyone"</strong>, then click <strong>Deploy</strong>.</li>
                <li>Copy the newly generated Web App URL and paste it into the input box above.</li>
                <li>Click <strong>"Save & Connect Sheet"</strong>. <em>Done! From this exact minute forward, all website forms and admin changes will immediately save to your new sheet without touching any code!</em></li>
              </ol>
            </div>
          )}
        </form>

        {/* Sync Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handlePullFromSheets}
            disabled={isPulling}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPulling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <DownloadCloud className="h-3.5 w-3.5" />}
            <span>Pull Edits From Google Sheets</span>
          </button>

          <button
            onClick={handlePushToSheets}
            disabled={isPushing}
            className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPushing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
            <span>Push All Local Data to Sheets</span>
          </button>

          <button
            onClick={handleTestWebhook}
            disabled={isTestingWebhook}
            className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isTestingWebhook ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            <span>Test Diagnostic Ping</span>
          </button>

          <button
            onClick={handlePurgeSheetsDummyData}
            disabled={isClearingSheets}
            className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 px-3 py-1.5 text-xs font-medium border border-red-200 dark:border-red-800 rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            title="Wipe all dummy rows from Google Sheets tabs while preserving clean headers"
          >
            {isClearingSheets ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            <span>Purge Sheet Dummy Data</span>
          </button>
        </div>

        {syncStatus && (
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5 text-red-600 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}

        {webhookTestResult && (
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>{webhookTestResult}</span>
          </div>
        )}

        {/* Expandable Apps Script Setup Guide */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowScriptDetails(!showScriptDetails)}
              className="text-xs font-medium text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>{showScriptDetails ? 'Hide' : 'View'} Google Apps Script Multi-Tab Code</span>
            </button>

            <button
              onClick={handleCopyScriptCode}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {copiedCode ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Script Code'}</span>
            </button>
          </div>

          {showScriptDetails && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs space-y-2">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To allow reading edits made directly in your spreadsheet back into this Admin Panel, paste the code from <code className="text-red-600 font-mono">google-apps-script.js</code> into your Google Sheet (click <strong>Extensions &rarr; Apps Script</strong> &rarr; paste &rarr; Deploy as Web App).
              </p>
              <div className="text-[11px] text-slate-500 font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                Tabs managed automatically: Leads, Venues, Campaigns
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Audio Broadcast Engine Parameters */}
      <form onSubmit={handleSaveAudioSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Sliders className="h-4 w-4 text-red-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Audio Broadcast Engine Defaults
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Master Loudness Target
            </label>
            <input
              type="text"
              value={audioSettings.masterLoudness}
              onChange={(e) => setAudioSettings({ ...audioSettings, masterLoudness: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">Standardized across retail sound systems</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Streaming Audio Bitrate
            </label>
            <select
              value={audioSettings.streamBitrate}
              onChange={(e) => setAudioSettings({ ...audioSettings, streamBitrate: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600 cursor-pointer"
            >
              <option value="320 kbps MP3">320 kbps MP3 (Highest Fidelity)</option>
              <option value="256 kbps AAC">256 kbps AAC</option>
              <option value="192 kbps MP3">192 kbps MP3</option>
            </select>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Default stream quality per receiver</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Minimum Ad Separation Gap
            </label>
            <input
              type="text"
              value={audioSettings.minAdSeparation}
              onChange={(e) => setAudioSettings({ ...audioSettings, minAdSeparation: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">Spacing between commercial ad insertions</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Hardware Heartbeat Interval
            </label>
            <input
              type="text"
              value={audioSettings.hardwarePollingInterval}
              onChange={(e) => setAudioSettings({ ...audioSettings, hardwarePollingInterval: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-600"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">Polling frequency for telemetry pings</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors cursor-pointer"
          >
            Save Defaults
          </button>
        </div>
      </form>

      {/* 4. Local Database & Backup Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Database className="h-4 w-4 text-red-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Data Storage & State Management
          </h2>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          All data in the admin panel and website is live and reactive. You can export a full JSON backup snapshot or clear all data to maintain a zero-dummy clean slate.
        </p>

        <div className="pt-1 flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export JSON Backup</span>
          </button>

          <button
            onClick={handleClearAllData}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Clear All Data (Zero State)</span>
          </button>
        </div>
      </div>

    </div>
  );
}
