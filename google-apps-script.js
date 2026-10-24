/**
 * ==============================================================================
 * YedZ Media - Enterprise CRM & Two-Way Programmatic Audio Network Engine
 * ==============================================================================
 * 
 * Version: 4.0 (Enterprise CRM Edition)
 * 
 * DESIGNED FOR BRAND NEW GOOGLE SHEETS:
 * This script transforms any blank Google Sheet into an executive-grade,
 * multi-tab CRM with automated category routing, frozen dark navy headers,
 * status validation dropdowns, custom tab colors, and live two-way website sync.
 * 
 * CRM TABS INCLUDED:
 *   1. 📈 Executive Dashboard   - Real-time KPI metrics & formula cards
 *   2. 📊 All Leads             - Master CRM router for all website inquiries
 *   3. 📢 Advertisers           - Ad flight inquiries, brand goals & budgets
 *   4. 🏪 Retail Partners       - In-store host applications, stores & footfall
 *   5. 💬 Contact Inquiries     - General partner messages & inquiries
 *   6. 📰 Newsletter Subscriptions - Email subscribers & subscriber status
 *   7. 📍 Venues Network        - Hardware audio receivers, venues & rev share
 *   8. 🎯 Campaigns (Ad Ops)    - Live audio ads, CPM, budget & impression pacing
 * 
 * HOW TO INSTALL IN YOUR NEW GOOGLE SHEET:
 * 1. Open your brand new Google Sheet.
 * 2. In the top menu, click Extensions -> Apps Script.
 * 3. Delete any default code, paste this entire file, and click Save (disk icon).
 * 4. In the toolbar function dropdown, select "initializeCRM" and click "Run".
 *    - (Click "Review permissions" -> select your Google Account -> "Advanced" -> "Go to (unsafe)" -> "Allow").
 * 5. Return to your Google Sheet — your complete CRM is built and formatted!
 * 6. Click Deploy -> New deployment:
 *    - Select type: Web app
 *    - Description: YedZ Media Enterprise CRM Engine v4.0
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the Web App URL and paste it into your .env as VITE_GOOGLE_SHEETS_URL.
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. CRM Schema & Visual Architecture Configuration
// ------------------------------------------------------------------------------

var CRM_SCHEMAS = {
  'All Leads': {
    color: '#2563eb', // Royal Blue
    headers: [
      'Lead ID', 'Timestamp', 'Form Source', 'First Name', 'Last Name',
      'Work Email', 'Phone', 'Company / Business', 'Message / Details',
      'Status', 'Priority', 'Internal Notes'
    ],
    widths: [130, 160, 180, 140, 140, 240, 140, 200, 300, 140, 110, 240]
  },
  'Advertisers': {
    color: '#dc2626', // Crimson Red
    headers: [
      'Lead ID', 'Timestamp', 'Form Source', 'First Name', 'Last Name',
      'Work Email', 'Phone', 'Company / Brand', 'Campaign Goals / Details',
      'Status', 'Priority', 'Internal Notes'
    ],
    widths: [130, 160, 180, 140, 140, 240, 140, 200, 300, 140, 110, 240]
  },
  'Retail Partners': {
    color: '#16a34a', // Emerald Green
    headers: [
      'Partner ID', 'Timestamp', 'Form Source', 'First Name', 'Last Name',
      'Work Email', 'Phone', 'Business Name', 'Locations Count', 'Business Type',
      'Status', 'Priority', 'Internal Notes'
    ],
    widths: [130, 160, 180, 140, 140, 240, 140, 200, 140, 180, 140, 110, 240]
  },
  'Contact Inquiries': {
    color: '#0284c7', // Sky Blue
    headers: [
      'Inquiry ID', 'Timestamp', 'Form Source', 'First Name', 'Last Name',
      'Work Email', 'Subject', 'Message Details', 'Status', 'Priority', 'Internal Notes'
    ],
    widths: [130, 160, 180, 140, 140, 240, 200, 300, 140, 110, 240]
  },
  'Newsletter Subscriptions': {
    color: '#9333ea', // Purple
    headers: [
      'Subscriber ID', 'Timestamp', 'Form Source', 'Work Email', 'Subscription Status'
    ],
    widths: [140, 160, 180, 280, 160]
  },
  'Venues Network': {
    color: '#ea580c', // Orange
    headers: [
      'Timestamp', 'ID', 'Venue Name', 'Category', 'City',
      'State', 'Full Address', 'Speakers Count', 'Monthly Footfall',
      'Status', 'Rev Share %', 'Receiver Hardware ID', 'Monthly Plays'
    ],
    widths: [160, 130, 200, 180, 140, 110, 260, 130, 140, 120, 120, 180, 130]
  },
  'Campaigns (Ad Ops)': {
    color: '#0d9488', // Teal
    headers: [
      'Timestamp', 'ID', 'Campaign Title', 'Client / Brand', 'Client Email',
      'Audio Creative URL', 'Duration (s)', 'Status', 'Target Venues',
      'Budget ($)', 'Spent ($)', 'Target Impressions',
      'Delivered Impressions', 'Start Date', 'End Date', 'CPM ($)'
    ],
    widths: [160, 130, 220, 180, 220, 240, 110, 120, 220, 130, 130, 150, 150, 130, 130, 110]
  }
};

var STATUS_OPTIONS          = ['New Lead', 'In Progress', 'Contacted', 'Qualified', 'Won / Active', 'Closed / Lost'];
var PRIORITY_OPTIONS        = ['High', 'Medium', 'Low'];
var VENUE_STATUS_OPTIONS    = ['online', 'offline', 'maintenance'];
var CAMPAIGN_STATUS_OPTIONS = ['active', 'paused', 'completed', 'scheduled'];

/**
 * Normalize frontend status values (lowercase) to valid sheet dropdown values.
 */
function normalizeStatus(s) {
  if (!s) return 'New Lead';
  var l = String(s).toLowerCase().trim();
  if (l === 'new' || l === 'new lead') return 'New Lead';
  if (l === 'contacted') return 'Contacted';
  if (l === 'in progress' || l === 'negotiating') return 'In Progress';
  if (l === 'qualified') return 'Qualified';
  if (l === 'converted' || l === 'won' || l === 'active') return 'Won / Active';
  if (l === 'closed' || l === 'archived' || l === 'lost') return 'Closed / Lost';
  for (var i = 0; i < STATUS_OPTIONS.length; i++) {
    if (STATUS_OPTIONS[i].toLowerCase() === l) return STATUS_OPTIONS[i];
  }
  return 'New Lead';
}

/**
 * Normalize frontend priority values to valid sheet dropdown values.
 */
function normalizePriority(p) {
  if (!p) return 'Medium';
  var l = String(p).toLowerCase().trim();
  if (l === 'high') return 'High';
  if (l === 'medium') return 'Medium';
  if (l === 'low') return 'Low';
  return 'Medium';
}

/**
 * Normalize venue status from frontend values to valid sheet dropdown.
 */
function normalizeVenueStatus(s) {
  if (!s) return 'online';
  var l = String(s).toLowerCase().trim();
  if (l === 'online') return 'online';
  if (l === 'offline') return 'offline';
  if (l === 'maintenance') return 'maintenance';
  return 'online';
}

/**
 * Normalize campaign status from frontend values to valid sheet dropdown.
 */
function normalizeCampaignStatus(s) {
  if (!s) return 'active';
  var l = String(s).toLowerCase().trim();
  if (l === 'active') return 'active';
  if (l === 'paused') return 'paused';
  if (l === 'completed') return 'completed';
  if (l === 'scheduled') return 'scheduled';
  return 'active';
}

// ------------------------------------------------------------------------------
// 2. Custom Spreadsheet Top Menu (Automatic upon opening sheet)
// ------------------------------------------------------------------------------

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('YedZ Media CRM')
    .addItem('⚡ Initialize / Refresh CRM Setup', 'initializeCRM')
    .addItem('📊 Build / Refresh Executive KPI Dashboard', 'buildDashboardTab')
    .addItem('🧹 Purge All Dummy Data (Fresh Start)', 'clearAllDummyData')
    .addSeparator()
    .addItem('🔄 Test Two-Way Webhook Connectivity', 'testWebhookProbe')
    .addToUi();
}

// ------------------------------------------------------------------------------
// 3. One-Click Full Setup & Maintenance Functions
// ------------------------------------------------------------------------------

/**
 * MASTER SETUP: Creates and formats every tab from scratch, sets colors,
 * builds the Executive Dashboard, applies validations, and cleans up Sheet1.
 */
function initializeCRM() {
  Logger.log("Initializing YedZ Media Enterprise CRM Architecture...");
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Build each CRM and Ad Ops sheet first so formulas have existing targets
  for (var tabName in CRM_SCHEMAS) {
    buildFormattedSheet(ss, tabName, CRM_SCHEMAS[tabName]);
  }

  // 2. Build the Executive KPI Dashboard tab and place it first
  buildDashboardTab(ss);

  // 3. Remove default empty Sheet1 if present
  removeDefaultSheet1(ss);

  Logger.log("✅ Enterprise CRM successfully built and formatted!");
  Logger.log("✅ Ready for two-way programmatic dynamic synchronization!");
  return "YedZ Media CRM setup completed successfully!";
}

/**
 * Manual test function alias so users can select either "testSetup" or "initializeCRM"
 */
function testSetup() {
  return initializeCRM();
}

/**
 * PURGE DUMMY DATA: Clears all rows below row 1 across all sheets,
 * preserving all Dark Navy headers, dropdown validations, and dashboard formulas.
 */
function clearAllDummyData() {
  Logger.log("Purging all test and dummy data across CRM tabs...");
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  for (var tabName in CRM_SCHEMAS) {
    var sheet = ss.getSheetByName(tabName);
    var conf = CRM_SCHEMAS[tabName];
    if (sheet) {
      sheet.clear();
      applyNavyHeader(sheet, conf.headers);
      applySheetStylingAndValidations(sheet, tabName, conf);
    } else {
      buildFormattedSheet(ss, tabName, conf);
    }
  }

  // Re-build dashboard formulas
  buildDashboardTab(ss);
  removeDefaultSheet1(ss);

  Logger.log("✅ All dummy data purged from CRM!");
  Logger.log("✅ Clean slate ready for fresh live production sync starting today.");
  return "All dummy data removed successfully!";
}

/**
 * Diagnostic ping probe to verify web routing from script
 */
function testWebhookProbe() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  handleLeadSync(ss, {
    formType: 'Diagnostic Probe',
    firstName: 'Telemetry',
    lastName: 'Verifier',
    email: 'probe@yedzmedia.com',
    company: 'YedZ Media Systems',
    message: 'Two-way CRM telemetry verification probe'
  });
  SpreadsheetApp.getUi().alert('✅ Success! Test record appended to All Leads and formatted.');
}

// ------------------------------------------------------------------------------
// 4. HTTP Request Handlers (doGet & doPost)
// ------------------------------------------------------------------------------

/**
 * GET Handler: Serves live CRM data to Admin Panel and responds to telemetry pings
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) || 'getData';

    if (action === 'ping') {
      return jsonResponse({
        status: 'active',
        message: 'YedZ Media Enterprise CRM Engine is online and responsive!'
      });
    }

    if (action === 'clearData' || action === 'reset') {
      clearAllDummyData();
      return jsonResponse({
        status: 'success',
        message: 'All dummy rows removed from Google Sheets.'
      });
    }

    // Retrieve master leads
    var leads = readSheetRows(ss, 'All Leads');
    if (leads.length === 0) leads = readSheetRows(ss, 'Leads');

    // Retrieve venues and campaigns
    var venues = readSheetRows(ss, 'Venues Network');
    if (venues.length === 0) venues = readSheetRows(ss, 'Venues');

    var campaigns = readSheetRows(ss, 'Campaigns (Ad Ops)');
    if (campaigns.length === 0) campaigns = readSheetRows(ss, 'Campaigns');

    return jsonResponse({
      status: 'success',
      timestamp: new Date().toISOString(),
      leads: leads,
      venues: venues,
      campaigns: campaigns
    });

  } catch (err) {
    return jsonResponse({
      status: 'error',
      message: err.toString()
    });
  }
}

/**
 * POST Handler: Real-time form ingestion, entity updates, and deletions
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    var data = raw ? JSON.parse(raw) : {};

    var action = data.action || data.type || (data.formType ? 'lead' : 'ping');

    if (action === 'lead' || data.formType) {
      handleLeadSync(ss, data);
    } else if (action === 'venue') {
      handleVenueSync(ss, data);
    } else if (action === 'campaign') {
      handleCampaignSync(ss, data);
    } else if (action === 'bulkSync') {
      handleBulkSync(ss, data);
    } else if (action === 'clearData' || action === 'reset') {
      clearAllDummyData();
    }

    return jsonResponse({
      result: 'success',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return jsonResponse({
      result: 'error',
      message: err.toString()
    });
  }
}

// ------------------------------------------------------------------------------
// 5. Automated Multi-Tab Synchronization & Routing
// ------------------------------------------------------------------------------

function handleLeadSync(ss, data) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  data = data || {};

  var id = data.id || ('YDZ-LD-' + Math.floor(1000 + Math.random() * 9000));
  var timestamp = formatReadableDate(data.createdAt);
  var formSource = normalizeFormSource(data.formType);
  var firstName = data.firstName || '';
  var lastName = data.lastName || '';
  var workEmail = data.email || '';
  var phone = data.phone || '';
  var company = data.company || data.businessName || '';
  var messageDetails = data.message || data.goals || '';

  if (data.locationsCount) {
    messageDetails = 'Locations: ' + data.locationsCount + ' | Type: ' + (data.businessType || 'Retail');
  }

  var status = normalizeStatus(data.status);
  var priority = normalizePriority(data.priority) || (formSource.indexOf('Advertiser') !== -1 ? 'High' : 'Medium');
  var notes = data.notes || '';

  // --- Handle UPDATE event: find existing row by ID or email and update in-place ---
  if (data.event === 'update') {
    var masterSheet = getOrCreateSheet(ss, 'All Leads');
    var updateRow = -1;
    // Try to find by Lead ID first (column 1), then by email (column 6)
    if (data.id) updateRow = findRowByColumn(masterSheet, data.id, 1);
    if (updateRow < 0 && workEmail) updateRow = findRowByColumn(masterSheet, workEmail, 6);
    if (updateRow > 0) {
      if (data.status) masterSheet.getRange(updateRow, 10).setValue(status);
      if (data.priority) masterSheet.getRange(updateRow, 11).setValue(priority);
      if (data.notes !== undefined) masterSheet.getRange(updateRow, 12).setValue(notes);
      if (data.company || data.businessName) masterSheet.getRange(updateRow, 8).setValue(company);
      if (data.message || data.goals) masterSheet.getRange(updateRow, 9).setValue(messageDetails);
      return; // Updated in place — do not append
    }
    // If row not found, fall through to append as new
  }

  // --- Handle DELETE event: remove from All Leads AND category sub-sheets ---
  if (data.event === 'delete') {
    var leadTabs = ['All Leads', 'Advertisers', 'Retail Partners', 'Contact Inquiries', 'Newsletter Subscriptions'];
    for (var t = 0; t < leadTabs.length; t++) {
      var s = ss.getSheetByName(leadTabs[t]);
      if (s) {
        var deleted = false;
        if (data.id) deleted = deleteRowByColumn(s, data.id, 1);
        if (!deleted && workEmail) {
          var emailCol = (leadTabs[t] === 'Newsletter Subscriptions') ? 4 : 6;
          deleteRowByColumn(s, workEmail, emailCol);
        }
      }
    }
    return;
  }

  // --- Default: CREATE — Append to Master 'All Leads' sheet ---
  var masterSheet = getOrCreateSheet(ss, 'All Leads');
  var masterRow = [id, timestamp, formSource, firstName, lastName, workEmail, phone, company, messageDetails, status, priority, notes];
  masterSheet.appendRow(masterRow);
  styleLeadRow(masterSheet, masterSheet.getLastRow(), formSource);

  // Automatically Route into Category-Specific Sub-Sheet
  var subTabName = getCategoryTabName(formSource);
  if (subTabName && subTabName !== 'All Leads') {
    var subSheet = getOrCreateSheet(ss, subTabName);
    var subRow;

    if (subTabName === 'Advertisers') {
      subRow = [id, timestamp, formSource, firstName, lastName, workEmail, phone, company, messageDetails, status, priority, notes];
    } else if (subTabName === 'Retail Partners') {
      subRow = [id, timestamp, formSource, firstName, lastName, workEmail, phone, company, data.locationsCount || '1', data.businessType || 'Retail Store', status, priority, notes];
    } else if (subTabName === 'Contact Inquiries') {
      subRow = [id, timestamp, formSource, firstName, lastName, workEmail, data.subject || 'Website Inquiry', messageDetails, status, priority, notes];
    } else if (subTabName === 'Newsletter Subscriptions') {
      subRow = [id, timestamp, formSource, workEmail, 'Active'];
    }

    if (subRow) {
      subSheet.appendRow(subRow);
      styleLeadRow(subSheet, subSheet.getLastRow(), formSource);
    }
  }
}

function handleVenueSync(ss, data) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  data = data || {};
  var sheet = getOrCreateSheet(ss, 'Venues Network');
  var id = data.id || ('YDZ-VN-' + Math.floor(100 + Math.random() * 900));

  if (data.event === 'delete') {
    var vDeleted = false;
    if (id) vDeleted = deleteRowByColumn(sheet, id, 2);
    if (!vDeleted && data.name) {
      deleteRowByColumn(sheet, data.name, 3);
    }
    return;
  }

  var venueStatus = normalizeVenueStatus(data.status);

  if (data.event === 'update') {
    var row = findRowByColumn(sheet, id, 2);
    if (row > 0) {
      if (data.name) sheet.getRange(row, 3).setValue(data.name);
      if (data.category) sheet.getRange(row, 4).setValue(data.category);
      if (data.city) sheet.getRange(row, 5).setValue(data.city);
      if (data.state) sheet.getRange(row, 6).setValue(data.state);
      if (data.address) sheet.getRange(row, 7).setValue(data.address);
      if (data.speakersCount !== undefined) sheet.getRange(row, 8).setValue(data.speakersCount);
      if (data.monthlyFootfall !== undefined) sheet.getRange(row, 9).setValue(data.monthlyFootfall);
      if (data.status) sheet.getRange(row, 10).setValue(venueStatus);
      if (data.partnerRevenueSharePct !== undefined) sheet.getRange(row, 11).setValue(data.partnerRevenueSharePct);
      if (data.streamReceiverId) sheet.getRange(row, 12).setValue(data.streamReceiverId);
      return;
    }
  }

  sheet.appendRow([
    new Date().toISOString(), id, data.name || '', data.category || '', data.city || '',
    data.state || '', data.address || '', data.speakersCount || 0, data.monthlyFootfall || 0,
    venueStatus, data.partnerRevenueSharePct || 40, data.streamReceiverId || '', data.monthlyPlays || 0
  ]);
}

function handleCampaignSync(ss, data) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  data = data || {};
  var sheet = getOrCreateSheet(ss, 'Campaigns (Ad Ops)');
  var id = data.id || ('YDZ-CP-' + Math.floor(100 + Math.random() * 900));

  if (data.event === 'delete') {
    var cDeleted = false;
    if (id) cDeleted = deleteRowByColumn(sheet, id, 2);
    if (!cDeleted && data.title) {
      deleteRowByColumn(sheet, data.title, 3);
    }
    return;
  }

  var campaignStatus = normalizeCampaignStatus(data.status);

  if (data.event === 'update') {
    var row = findRowByColumn(sheet, id, 2);
    if (row > 0) {
      if (data.title) sheet.getRange(row, 3).setValue(data.title);
      if (data.client) sheet.getRange(row, 4).setValue(data.client);
      if (data.clientEmail) sheet.getRange(row, 5).setValue(data.clientEmail);
      if (data.audioUrl) sheet.getRange(row, 6).setValue(data.audioUrl);
      if (data.durationSeconds) sheet.getRange(row, 7).setValue(data.durationSeconds);
      if (data.status) sheet.getRange(row, 8).setValue(campaignStatus);
      if (data.targetVenues) sheet.getRange(row, 9).setValue(Array.isArray(data.targetVenues) ? data.targetVenues.join(', ') : data.targetVenues);
      if (data.budget !== undefined) sheet.getRange(row, 10).setValue(data.budget);
      if (data.spent !== undefined) sheet.getRange(row, 11).setValue(data.spent);
      if (data.impressionsTarget !== undefined) sheet.getRange(row, 12).setValue(data.impressionsTarget);
      if (data.impressionsDelivered !== undefined) sheet.getRange(row, 13).setValue(data.impressionsDelivered);
      if (data.startDate) sheet.getRange(row, 14).setValue(data.startDate);
      if (data.endDate) sheet.getRange(row, 15).setValue(data.endDate);
      if (data.cpm !== undefined) sheet.getRange(row, 16).setValue(data.cpm);
      return;
    }
  }

  sheet.appendRow([
    new Date().toISOString(), id, data.title || '', data.client || '', data.clientEmail || '',
    data.audioUrl || '', data.durationSeconds || 15, campaignStatus,
    Array.isArray(data.targetVenues) ? data.targetVenues.join(', ') : (data.targetVenues || ''),
    data.budget || 0, data.spent || 0, data.impressionsTarget || 0, data.impressionsDelivered || 0,
    data.startDate || '', data.endDate || '', data.cpm || 0
  ]);
}

function handleBulkSync(ss, data) {
  if (data.leads && Array.isArray(data.leads)) {
    for (var h = 0; h < data.leads.length; h++) handleLeadSync(ss, data.leads[h]);
  }
  if (data.venues && Array.isArray(data.venues)) {
    for (var i = 0; i < data.venues.length; i++) handleVenueSync(ss, data.venues[i]);
  }
  if (data.campaigns && Array.isArray(data.campaigns)) {
    for (var j = 0; j < data.campaigns.length; j++) handleCampaignSync(ss, data.campaigns[j]);
  }
}

// ------------------------------------------------------------------------------
// 6. Executive KPI Dashboard Tab Builder
// ------------------------------------------------------------------------------

/**
 * Creates the high-level Executive Dashboard tab with formulas and stylized KPI cards
 */
function buildDashboardTab(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Executive Dashboard');
  if (!sheet) {
    sheet = ss.insertSheet('Executive Dashboard', 0);
  } else {
    sheet.clear();
    try {
      ss.setActiveSheet(sheet);
      ss.moveActiveSheet(1);
    } catch (moveErr) { }
  }

  try { sheet.setTabColor('#e11d48'); } catch (colorErr) { }
  try { sheet.setHideGridlines(true); } catch (gridErr) { }

  // Title Banner
  sheet.getRange('B2:H2').merge()
    .setValue('🎙️ YedZ Media - Programmatic In-Store Audio Network CRM')
    .setFontWeight('bold').setFontSize(16).setFontColor('#0b132b');

  sheet.getRange('B3:H3').merge()
    .setValue('Live Executive Dashboard & Real-Time Performance Analytics')
    .setFontSize(11).setFontColor('#64748b');

  // KPI Metric Cards Row 1
  buildKpiCard(sheet, 'B5:C7', 'Total Leads Received', '=IFERROR(COUNTA(\'All Leads\'!A2:A), 0)', '#2563eb');
  buildKpiCard(sheet, 'D5:E7', 'Active Leads in Funnel', '=IFERROR(COUNTIF(\'All Leads\'!J2:J, "New Lead") + COUNTIF(\'All Leads\'!J2:J, "In Progress"), 0)', '#f59e0b');
  buildKpiCard(sheet, 'F5:G7', 'Qualified / Won Leads', '=IFERROR(COUNTIF(\'All Leads\'!J2:J, "Qualified") + COUNTIF(\'All Leads\'!J2:J, "Won / Active"), 0)', '#16a34a');

  // KPI Metric Cards Row 2
  buildKpiCard(sheet, 'B9:C11', 'Active Retail Venues', '=IFERROR(COUNTA(\'Venues Network\'!A2:A), 0)', '#ea580c');
  buildKpiCard(sheet, 'D9:E11', 'Monthly Footfall Reach', '=IFERROR(SUM(\'Venues Network\'!I2:I), 0)', '#8b5cf6', '#,##0');
  buildKpiCard(sheet, 'F9:G11', 'Live Ad Campaigns', '=IFERROR(COUNTA(\'Campaigns (Ad Ops)\'!A2:A), 0)', '#0d9488');

  // Column widths for dashboard layout
  sheet.setColumnWidth(1, 30);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 130);
  sheet.setColumnWidth(7, 130);
}

function buildKpiCard(sheet, rangeA1, title, formula, accentColor, numberFormat) {
  var range = sheet.getRange(rangeA1);
  range.setBackground('#ffffff')
    .setBorder(true, true, true, true, false, false, '#e2e8f0', SpreadsheetApp.BorderStyle.SOLID);

  var topCell = sheet.getRange(rangeA1.split(':')[0]);
  var row = topCell.getRow();
  var col = topCell.getColumn();

  sheet.getRange(row, col, 1, 2).merge()
    .setValue(title)
    .setFontWeight('bold').setFontSize(10).setFontColor(accentColor);

  var valueCell = sheet.getRange(row + 1, col, 2, 2).merge()
    .setFormula(formula)
    .setFontWeight('bold').setFontSize(20).setFontColor('#0b132b')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  if (numberFormat) {
    valueCell.setNumberFormat(numberFormat);
  }
}

// ------------------------------------------------------------------------------
// 7. Styling, Validations & Sheet Utilities
// ------------------------------------------------------------------------------

function buildFormattedSheet(ss, tabName, conf) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
  } else {
    sheet.clear();
  }

  // Set individual colored tab indicator on the bottom bar
  if (conf.color) {
    sheet.setTabColor(conf.color);
  }

  // Apply Obsidian Dark Navy header row
  applyNavyHeader(sheet, conf.headers);

  // Apply column widths & dropdown rules
  applySheetStylingAndValidations(sheet, tabName, conf);
  return sheet;
}

function applyNavyHeader(sheet, headers) {
  sheet.appendRow(headers);
  var range = sheet.getRange(1, 1, 1, headers.length);
  range.setFontWeight('bold');
  range.setBackground('#0b132b'); // Deep Dark Navy from official UI
  range.setFontColor('#ffffff');   // Crisp pure white text
  range.setFontSize(10);
  range.setFontFamily('Arial');
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
}

function applySheetStylingAndValidations(sheet, tabName, conf) {
  // Set custom column widths
  if (conf.widths && conf.widths.length > 0) {
    for (var i = 0; i < conf.widths.length; i++) {
      sheet.setColumnWidth(i + 1, conf.widths[i]);
    }
  }

  // Status column dropdown validation (per tab type)
  var statusCol = conf.headers.indexOf('Status') + 1;
  if (statusCol > 0) {
    var validStatuses = STATUS_OPTIONS;
    if (tabName === 'Venues Network') validStatuses = VENUE_STATUS_OPTIONS;
    else if (tabName === 'Campaigns (Ad Ops)') validStatuses = CAMPAIGN_STATUS_OPTIONS;

    var statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(validStatuses, true)
      .setAllowInvalid(true)
      .build();
    sheet.getRange(2, statusCol, 999, 1).setDataValidation(statusRule);
  }

  // Priority column dropdown validation
  var priorityCol = conf.headers.indexOf('Priority') + 1;
  if (priorityCol > 0) {
    var priorityRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(PRIORITY_OPTIONS, true)
      .setAllowInvalid(true)
      .build();
    sheet.getRange(2, priorityCol, 999, 1).setDataValidation(priorityRule);
  }

  // Number format for currency & impressions
  var budgetCol = conf.headers.indexOf('Budget ($)') + 1;
  if (budgetCol > 0) sheet.getRange(2, budgetCol, 999, 1).setNumberFormat('$#,##0.00');

  var spentCol = conf.headers.indexOf('Spent ($)') + 1;
  if (spentCol > 0) sheet.getRange(2, spentCol, 999, 1).setNumberFormat('$#,##0.00');

  var cpmCol = conf.headers.indexOf('CPM ($)') + 1;
  if (cpmCol > 0) sheet.getRange(2, cpmCol, 999, 1).setNumberFormat('$#,##0.00');

  var footfallCol = conf.headers.indexOf('Monthly Footfall') + 1;
  if (footfallCol > 0) sheet.getRange(2, footfallCol, 999, 1).setNumberFormat('#,##0');

  var targetImpCol = conf.headers.indexOf('Target Impressions') + 1;
  if (targetImpCol > 0) sheet.getRange(2, targetImpCol, 999, 1).setNumberFormat('#,##0');

  var delivImpCol = conf.headers.indexOf('Delivered Impressions') + 1;
  if (delivImpCol > 0) sheet.getRange(2, delivImpCol, 999, 1).setNumberFormat('#,##0');
}

function getOrCreateSheet(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    var conf = CRM_SCHEMAS[tabName] || {
      headers: ['Timestamp', 'ID', 'Details'],
      widths: [160, 140, 300]
    };
    sheet = buildFormattedSheet(ss, tabName, conf);
  }
  return sheet;
}

function removeDefaultSheet1(ss) {
  var badSheets = ['Sheet1', 'Leads'];
  for (var i = 0; i < badSheets.length; i++) {
    var s = ss.getSheetByName(badSheets[i]);
    if (s && ss.getSheets().length > 1) {
      try {
        ss.deleteSheet(s);
      } catch (e) { }
    }
  }
}

function styleLeadRow(sheet, rowNumber, formSource) {
  try {
    var cell = sheet.getRange(rowNumber, 3); // Column C: Form Source
    cell.setFontWeight('bold');
    cell.setHorizontalAlignment('center');

    if (formSource.indexOf('Advertiser') !== -1) {
      cell.setFontColor('#991b1b');
      cell.setBackground('#fee2e2'); // Soft red badge
    } else if (formSource.indexOf('Partner') !== -1 || formSource.indexOf('Retail') !== -1) {
      cell.setFontColor('#166534');
      cell.setBackground('#dcfce7'); // Soft green badge
    } else if (formSource.indexOf('Newsletter') !== -1) {
      cell.setFontColor('#6b21a8');
      cell.setBackground('#f3e8ff'); // Soft purple badge
    } else if (formSource.indexOf('Contact') !== -1) {
      cell.setFontColor('#075985');
      cell.setBackground('#e0f2fe'); // Soft blue badge
    }
  } catch (err) { }
}

function normalizeFormSource(source) {
  if (!source) return 'Website Lead';
  var s = source.toLowerCase();
  if (s.indexOf('advertiser') !== -1) return 'Advertisers Page Lead';
  if (s.indexOf('partner') !== -1 || s.indexOf('retail') !== -1) return 'Retail Partner Inquiry';
  if (s.indexOf('newsletter') !== -1) return 'Newsletter Subscription';
  if (s.indexOf('contact') !== -1) return 'Contact Page Inquiry';
  return source;
}

function getCategoryTabName(normalizedSource) {
  if (normalizedSource === 'Advertisers Page Lead') return 'Advertisers';
  if (normalizedSource === 'Retail Partner Inquiry') return 'Retail Partners';
  if (normalizedSource === 'Contact Page Inquiry') return 'Contact Inquiries';
  if (normalizedSource === 'Newsletter Subscription') return 'Newsletter Subscriptions';
  return null;
}

function formatReadableDate(isoString) {
  try {
    var d = isoString ? new Date(isoString) : new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  } catch (e) {
    return new Date().toISOString().replace('T', ' ').slice(0, 19);
  }
}

function deleteRowByColumn(sheet, matchVal, colNumber) {
  var data = sheet.getDataRange().getValues();
  var colIdx = (colNumber && colNumber > 0) ? colNumber - 1 : 0;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIdx]).trim() === String(matchVal).trim()) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function findRowByColumn(sheet, matchVal, colNumber) {
  var data = sheet.getDataRange().getValues();
  var colIdx = (colNumber && colNumber > 0) ? colNumber - 1 : 0;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIdx]).trim() === String(matchVal).trim()) {
      return i + 1;
    }
  }
  return -1;
}

function readSheetRows(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var key = String(headers[j]).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      obj[key] = row[j];
      obj[headers[j]] = row[j];
    }
    rows.push(obj);
  }
  return rows;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
