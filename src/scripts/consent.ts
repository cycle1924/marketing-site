// Cookie consent gate.
//
// Nothing that tracks a visitor runs until they say yes. The HubSpot loader
// used to sit in the page head, which meant it set its cookies on first paint,
// before anyone had a chance to decline. It is now injected from here and only
// after an explicit Accept.
//
// The contact form is deliberately NOT gated. Someone filling it in is asking
// us to contact them, so the submit goes through either way. Without consent
// there is simply no tracking cookie to attach, and lib/hubspot.ts already
// treats a missing token as normal.

const STORAGE_KEY = 'peel-cookie-consent';
const CONSENT_VERSION = 1;

export type ConsentChoice = 'accepted' | 'declined';

interface StoredConsent {
  choice: ConsentChoice;
  at: string;
  v: number;
}

// Cookies HubSpot sets once its loader runs. Listed here so a visitor who
// changes their mind to Decline does not keep carrying the ones they already
// picked up. Names come from HubSpot's own cookie documentation.
const HUBSPOT_COOKIES = ['hubspotutk', '__hstc', '__hssrc', '__hssc', '__hs_opt_out', '__hs_initial_opt_in'];

// Every storage call is wrapped: Safari in private mode and a browser with
// site data blocked both throw on access rather than returning null, and a
// thrown error here would take the whole banner down with it.
function readConsent(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.v !== CONSENT_VERSION) return null;
    return parsed.choice === 'accepted' || parsed.choice === 'declined' ? parsed.choice : null;
  } catch {
    return null;
  }
}

function writeConsent(choice: ConsentChoice): void {
  try {
    const value: StoredConsent = { choice, at: new Date().toISOString(), v: CONSENT_VERSION };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage unavailable. The choice still applies to this page view; the
    // banner will simply ask again next time, which is the safe direction.
  }
}

// Expires a cookie on this host and on the registrable domain, because
// HubSpot sets its cookies on the parent domain so they carry across
// subdomains. Without the second form the cookie survives the delete.
function expireCookie(name: string): void {
  const hostParts = window.location.hostname.split('.');
  const domains = [
    undefined,
    window.location.hostname,
    hostParts.length > 2 ? `.${hostParts.slice(-2).join('.')}` : `.${window.location.hostname}`,
  ];
  domains.forEach((domain) => {
    const scope = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${scope}`;
  });
}

function clearHubspotCookies(): void {
  HUBSPOT_COOKIES.forEach(expireCookie);
}

let loaded = false;

// Injects the HubSpot tracking loader. Guarded so that accepting twice, or
// accepting on a page where it already ran, does not add a second script tag.
export function loadHubspot(portalId: string, region: string): void {
  if (loaded || document.getElementById('hs-script-loader')) return;
  loaded = true;
  const script = document.createElement('script');
  script.id = 'hs-script-loader';
  script.async = true;
  script.defer = true;
  script.type = 'text/javascript';
  script.src = `https://js-${region}.hs-scripts.com/${portalId}.js`;
  document.head.appendChild(script);
}

export function wireConsent(): void {
  const banner = document.getElementById('cookie-banner');
  const accept = document.getElementById('cookie-accept');
  const decline = document.getElementById('cookie-decline');
  if (!banner || !accept || !decline) return;

  // Read from data attributes rather than an inlined script, so the page
  // needs no 'unsafe-inline' in its Content-Security-Policy.
  const portalId = banner.dataset.portalId;
  const region = banner.dataset.region;
  if (!portalId || !region) return;

  const show = () => {
    banner.hidden = false;
  };
  const hide = () => {
    banner.hidden = true;
  };

  const choose = (choice: ConsentChoice) => {
    writeConsent(choice);
    hide();
    if (choice === 'accepted') {
      loadHubspot(portalId, region);
    } else {
      clearHubspotCookies();
    }
  };

  accept.addEventListener('click', () => choose('accepted'));
  decline.addEventListener('click', () => choose('declined'));

  // Any link or button marked data-cookie-settings reopens the banner, which
  // is how someone changes their mind later. The footer carries one on every
  // page, so a decision is never final.
  document.querySelectorAll('[data-cookie-settings]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      show();
      accept.focus();
    });
  });

  const existing = readConsent();
  if (existing === 'accepted') {
    loadHubspot(portalId, region);
  } else if (existing === null) {
    show();
  }
}
