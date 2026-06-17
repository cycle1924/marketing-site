// HubSpot form configuration.
//
// The white paper and demo forms are wired to HubSpot using the portal ID,
// region, and form GUIDs below. The shared client handler posts the existing
// form fields to the HubSpot Forms submission API for the matching region and
// then shows each form's designed success state.

export interface FormsConfig {
  hubspotPortalId: string;
  hubspotRegion: string;
  whitepaperFormGuid: string;
  demoFormGuid: string;
}

export const forms: FormsConfig = {
  hubspotPortalId: '244843197',
  hubspotRegion: 'na2',
  whitepaperFormGuid: '380a277f-bf21-4cd0-9df2-2a8bbc8dee8e',
  demoFormGuid: '94a9e515-5700-4571-a7b5-b1b039867bfb',
};

// Maps the demo form's control name attributes to HubSpot custom property
// internal names for the payload. Standard properties (firstname, lastname,
// company, email, phone) are sent unchanged and are not listed here.
export const demoFieldMap: Record<string, string> = {
  jobtitle: 'role',
  company_size: 'company_size',
  message: 'biggest_operational_challenge',
};

