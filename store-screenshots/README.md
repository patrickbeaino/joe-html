# Store Screenshot System (Resk Lebanon)

## Files
- `index.html` – 5 marketing screenshot compositions
- `styles.css` – visual system, layout, and responsive App Store / Play Store sizing
- `export.mjs` – optional Playwright export script

## Export screenshots
From repo root:

```bash
cd store-screenshots
node export.mjs
```

If Playwright is not installed:

```bash
npm i -D playwright
npx playwright install chromium
node export.mjs
```

## Notes
- Base branding follows app theme: Inter typography and Resk gradient (`#EF475C → #8C191B`).
- Existing app assets are referenced directly from `resk_lebanon_customer_app/assets/`.
