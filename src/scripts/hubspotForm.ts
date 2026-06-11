// Client-side form wiring shared by the white paper and demo pages.
//
// When the HubSpot config still holds placeholder values, the submit is
// intercepted and the success state is shown without calling the API.
// Once real values are set in src/config/forms.ts, the same handler posts
// to the HubSpot Forms API and then shows the success state.
import { forms, isFormConfigured } from '../config/forms';

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

async function postToHubspot(portalId: string, formGuid: string, form: HTMLFormElement): Promise<void> {
  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
  await fetch(endpoint, {
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
}

export function wireHubspotForm(opts: WireOptions): void {
  const form = document.getElementById(opts.formId) as HTMLFormElement | null;
  const card = document.getElementById(opts.cardId);
  const success = document.getElementById(opts.successId);
  if (!form || !card || !success) return;

  const portalId = forms.hubspotPortalId;
  const formGuid = opts.which === 'whitepaper' ? forms.whitepaperFormGuid : forms.demoFormGuid;

  const showSuccess = () => {
    card.classList.add('hidden');
    success.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    if (isFormConfigured(portalId, formGuid)) {
      try {
        await postToHubspot(portalId, formGuid, form);
      } catch (err) {
        // The designed flow has a single success state. Log for debugging
        // and still confirm to the visitor so the experience is not broken.
        console.error('HubSpot submission failed', err);
      }
    }
    showSuccess();
  });
}
