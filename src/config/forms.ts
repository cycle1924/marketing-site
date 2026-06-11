// HubSpot form configuration.
//
// Replace the "TBD" placeholders with the real HubSpot portal ID and form
// GUIDs to wire the white paper and demo forms to HubSpot. While any value
// below is still "TBD", the forms intercept their submit and show the
// success state instead of calling the API, so the site demos cleanly
// before HubSpot is connected.

export const PLACEHOLDER = 'TBD';

export interface FormsConfig {
  hubspotPortalId: string;
  whitepaperFormGuid: string;
  demoFormGuid: string;
}

export const forms: FormsConfig = {
  hubspotPortalId: PLACEHOLDER,
  whitepaperFormGuid: PLACEHOLDER,
  demoFormGuid: PLACEHOLDER,
};

// A form is wired only when the portal ID and that form's GUID are both set
// to something other than the placeholder.
export function isFormConfigured(portalId: string, formGuid: string): boolean {
  return portalId !== PLACEHOLDER && formGuid !== PLACEHOLDER;
}
