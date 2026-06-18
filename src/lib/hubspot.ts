// Shared HubSpot submission helper used by every custom form on the site.
//
// This runs in the visitor's browser so two things happen that a server-side
// submit cannot do on its own: HubSpot records the request IP, and the
// submission carries the visitor's tracking token. With the token present,
// HubSpot can link the submission to a known contact and attribute a source.
import { forms } from '../config/forms';

export interface HubspotField {
  name: string;
  value: string;
}

// The tracking context HubSpot reads for attribution. hutk is optional because
// the tracking cookie may not be set yet on a visitor's first interaction.
interface HubspotContext {
  hutk?: string;
  pageUri: string;
  pageName: string;
}

// Reads the hubspotutk cookie set by the HubSpot tracking script. Returns
// undefined when the cookie is absent so the submit can still proceed without
// the token rather than failing.
function readTrackingCookie(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

// Builds the submission context from the live page: the tracking token when
// present, the current URL, and the document title.
export function buildContext(): HubspotContext {
  const context: HubspotContext = {
    pageUri: window.location.href,
    pageName: document.title,
  };
  const hutk = readTrackingCookie();
  if (hutk) context.hutk = hutk;
  return context;
}

// Posts the given fields to the HubSpot Forms submission API for the configured
// portal, region, and the supplied form GUID, including the tracking context.
// Throws on a non-OK response so callers can surface an inline error.
export async function submitHubspotForm(
  formGuid: string,
  fields: HubspotField[],
): Promise<void> {
  const endpoint = `https://api-${forms.hubspotRegion}.hsforms.com/submissions/v3/integration/submit/${forms.hubspotPortalId}/${formGuid}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields, context: buildContext() }),
  });
  if (!response.ok) {
    throw new Error(`HubSpot submission failed with status ${response.status}`);
  }
}
