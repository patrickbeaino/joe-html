import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = `file://${path.join(__dirname, 'index.html')}`;

const ids = ['shot-1', 'shot-2', 'shot-3', 'shot-4', 'shot-5'];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 3000 } });
await page.goto(url);

for (const id of ids) {
  const el = page.locator(`#${id}`);
  await el.screenshot({ path: path.join(__dirname, `${id}-iphone-1290x2796.png`) });
}

await browser.close();
console.log('Exported 5 screenshots.');
