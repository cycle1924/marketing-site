// Client-side form wiring shared by the white paper and demo pages.
//
// The handler collects the existing form fields and hands them to the shared
// HubSpot submit helper, which adds the tracking context and posts to the
// Forms submission API, then shows each form's designed success state. On a
// failed submit it shows a simple inline error and keeps the visitor's input
// intact so they can try again.
import { forms, demoFieldMap } from '../config/forms';
import { submitHubspotForm } from '../lib/hubspot';

interface WireOptions {
  formId: string;
  cardId: string;
  successId: string;
  which: 'whitepaper' | 'demo';
}

function collectFields(
  form: HTMLFormElement,
  fieldMap: Record<string, string>,
): { name: string; value: string }[] {
  const fields: { name: string; value: string }[] = [];
  const controls = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[name]');
  controls.forEach((control) => {
    if (control.value) {
      fields.push({ name: fieldMap[control.name] ?? control.name, value: control.value });
    }
  });
  return fields;
}

export function wireHubspotForm(opts: WireOptions): void {
  const form = document.getElementById(opts.formId) as HTMLFormElement | null;
  const card = document.getElementById(opts.cardId);
  const success = document.getElementById(opts.successId);
  if (!form || !card || !success) return;

  const formGuid = opts.which === 'whitepaper' ? forms.whitepaperFormGuid : forms.demoFormGuid;
  const fieldMap = opts.which === 'demo' ? demoFieldMap : {};

  // Inline error notice, created here so the page markup stays untouched.
  // The contact address comes from config so it is never hardcoded in the form.
  const error = document.createElement('p');
  error.className = 'form-error hidden';
  error.setAttribute('role', 'alert');
  error.textContent = `Something went wrong sending your request. Please try again. If it keeps happening, email us at ${forms.contactEmail}.`;
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
      await submitHubspotForm(formGuid, collectFields(form, fieldMap));
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
