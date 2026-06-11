# Cycle1924 marketing site

Static marketing site built with Astro.

## Local development

Requires Node 18.20 or newer.

```bash
npm install   # install dependencies
npm run dev   # start the dev server at http://localhost:4321
npm run build # build the static site to dist/
```

`npm run preview` serves the built `dist/` output locally.

## Design tokens

All color, type, spacing, radius, shadow, and layout values live as CSS
custom properties in `src/styles/tokens.css`. Component and page styles
reference those tokens only and contain no raw hex colors. The accent color
is named neutrally (`--color-accent`), so swapping the brand palette is a
single-file edit in `tokens.css`.

## Form configuration

HubSpot form wiring is configured in `src/config/forms.ts`: the portal ID
and the white paper and demo form GUIDs. While any value is the placeholder
`TBD`, the forms intercept submit and show their success state instead of
calling the API. Replace the placeholders with real values to send
submissions to HubSpot. The shared submit handler lives in
`src/scripts/hubspotForm.ts`.
