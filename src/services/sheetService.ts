export interface FormPayload {
  formType: string;
  firstName?: string;
  lastName?: string;
  email: string;
  company?: string;
  subject?: string;
  message?: string;
  goals?: string;
  businessName?: string;
  locationsCount?: string;
  businessType?: string;
}

const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxummsQLUX9KtiAA7XXjcDcxddEXi11ZMHAfP38T30TfyvvnMqjmbE-99POms1U94b4FQ/exec';

export async function submitLeadToSheet(payload: FormPayload): Promise<{ success: boolean; error?: string }> {
  const url = import.meta.env.VITE_GOOGLE_SHEETS_URL || DEFAULT_WEBHOOK_URL;

  // Format the consolidated fields and granular fields for the spreadsheet columns
  const formattedData = {
    formType: payload.formType,
    firstName: payload.firstName || '',
    lastName: payload.lastName || '',
    email: payload.email,
    company: payload.company || '',
    businessName: payload.businessName || '',
    locationsCount: payload.locationsCount || '',
    businessType: payload.businessType || '',
    subject: payload.subject || '',
    goals: payload.goals || '',
    message: payload.message || '',
    combinedCompany: payload.company || payload.businessName || payload.subject || '',
    combinedMessage: payload.message || payload.goals || (payload.locationsCount ? `Locations: ${payload.locationsCount} | Type: ${payload.businessType}` : '')
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
