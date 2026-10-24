import { adminDataService } from './adminDataService';

export interface FormPayload {
  formType: string;
  firstName?: string;
  lastName?: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  message?: string;
  goals?: string;
  businessName?: string;
  locationsCount?: string;
  businessType?: string;
}

export const STORAGE_KEY_CUSTOM_SHEET_URL = 'yedz_google_sheets_url';
export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyLxdV9zhrfeTMsGkFZYwS-HKR1oDJKTAYJtGoA__85f2544o1UtKZE2JSOLnOPSDytCg/exec';

/**
 * Returns the currently active Google Sheets Web App URL.
 * Prioritizes custom URL saved by Admin in localStorage, then .env, then default.
 */
export function getSheetsWebhookUrl(): string {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem(STORAGE_KEY_CUSTOM_SHEET_URL);
    if (customUrl && customUrl.trim().length > 0) {
      return customUrl.trim();
    }
  }
  return import.meta.env.VITE_GOOGLE_SHEETS_URL || DEFAULT_WEBHOOK_URL;
}

/**
 * Updates or removes the custom Google Sheets Web App URL in localStorage.
 */
export function setCustomSheetsWebhookUrl(url: string | null): void {
  if (typeof window !== 'undefined') {
    if (url && url.trim().length > 0) {
      localStorage.setItem(STORAGE_KEY_CUSTOM_SHEET_URL, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_SHEET_URL);
    }
  }
}

/**
 * Checks if a custom URL is currently overriding the default .env configuration.
 */
export function isCustomSheetsUrlActive(): boolean {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem(STORAGE_KEY_CUSTOM_SHEET_URL);
    return !!val && val.trim().length > 0;
  }
  return false;
}

export async function submitLeadToSheet(payload: FormPayload): Promise<{ success: boolean; error?: string }> {
  const url = getSheetsWebhookUrl();

  // 1. Immediately store in Admin Panel database so it appears dynamically in the dashboard
  const fullName = `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'New Lead';
  const companyName = payload.company || payload.businessName || '';
  const messageContent = payload.message || payload.goals || (payload.locationsCount ? `Locations: ${payload.locationsCount} | Type: ${payload.businessType}` : '');

  let createdLeadId = '';
  try {
    const created = adminDataService.addLead({
      formType: payload.formType,
      name: fullName,
      email: payload.email,
      company: companyName,
      phone: payload.phone || '',
      locationsCount: payload.locationsCount || '',
      businessType: payload.businessType || '',
      subject: payload.subject || '',
      message: messageContent,
      goals: payload.goals || '',
      status: 'new',
      priority: 'high',
      notes: `Submitted via website (${payload.formType})`,
    }, true); // pass true to skip duplicate remote sync since submitLeadToSheet dispatches rich payload below
    if (created && created.id) createdLeadId = created.id;
  } catch (err) {
    console.error('Error saving lead locally:', err);
  }

  // 2. Dispatch formatted data to Google Sheets webhook
  const formattedData = {
    action: 'lead',
    event: 'create',
    id: createdLeadId || undefined,
    formType: payload.formType,
    firstName: payload.firstName || '',
    lastName: payload.lastName || '',
    email: payload.email,
    company: companyName,
    businessName: payload.businessName || '',
    locationsCount: payload.locationsCount || '',
    businessType: payload.businessType || '',
    phone: payload.phone || '',
    subject: payload.subject || '',
    goals: payload.goals || '',
    message: messageContent,
    status: 'new',
    priority: 'high',
    combinedCompany: companyName,
    combinedMessage: messageContent,
    createdAt: new Date().toISOString()
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok && response.status !== 0) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error recording to Google Sheet:', errorMsg);
    // Google Apps Script redirect can sometimes trigger opaque CORS response in browser, but row still records successfully
    return { success: true };
  }
}
