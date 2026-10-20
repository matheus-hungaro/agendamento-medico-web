const { test } = require('@playwright/test');

test('capture browser errors', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER_CONSOLE: ' + msg.type() + ': ' + msg.text()));
  page.on('pageerror', err => console.log('PAGE_ERROR: ' + err.message));
  page.on('requestfailed', req => console.log('REQUEST_FAILED: ' + req.url() + ' :: ' + req.failure()?.errorText));

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('TITLE=', await page.title());
  console.log('BODY=', await page.locator('body').innerText());
});
