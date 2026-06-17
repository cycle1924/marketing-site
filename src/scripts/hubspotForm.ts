// Client-side form wiring shared by the white paper and demo pages.
//
// The handler posts the existing form fields to the HubSpot Forms submission
// API for the configured region and portal, then shows each form's designed
// success state. On a failed submit it shows a simple inline error and keeps
// the visitor's input intact so they can try again.
import { forms } from '../config/forms';

interface WireOptions {
  formId: string;
  cardId: string;
  successId: string;
  which: 'whitepaper' | 'demo';
}

function collectFields(form: HTMLFormElement): { name: string; value: string }[] {
  const fields: { name: string; value: string }[] = [];
  const controls = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[name]');
  controls.forEach((control) => {
    if (control.value) {
      fields.push({ name: control.name, value: control.value });
    }
  });
  return fields;
}

async function postToHubspot(formGuid: string, form: HTMLFormElement): Promise<void> {
  const endpoint = `https://api-${forms.hubspotRegion}.hsforms.com/submissions/v3/integration/submit/${forms.hubspotPortalId}/${formGuid}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: collectFields(form),
      context: {
        pageUri: window.location.href,
        pageName: document.title,
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`HubSpot submission failed with status ${response.status}`);
  }
}

export function wireHubspotForm(opts: WireOptions): void {
  const form = document.getElementById(opts.formId) as HTMLFormElement | null;
  const card = document.getElementById(opts.cardId);
  const success = document.getElementById(opts.successId);
  if (!form || !card || !success) return;

  const formGuid = opts.which === 'whitepaper' ? forms.whitepaperFormGuid : forms.demoFormGuid;

  // Inline error notice, created here so the page markup stays untouched.
  const error = document.createElement('p');
  error.className = 'form-error hidden';
  error.setAttribute('role', 'alert');
  error.textContent = 'Something went wrong sending your details. Please try again.';
  form.appendChild(error);

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  const showSuccess = () => {
    card.classList.add('hidden');
    success.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    error.classList.add('hidden');
    if (submitBtn) submitBtn.disabled = true;

    try {
      await postToHubspot(formGuid, form);
      showSuccess();
    } catch (err) {
      // Keep the visitor's input and surface a simple inline error.
      console.error('HubSpot submission failed', err);
      error.classList.remove('hidden');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
