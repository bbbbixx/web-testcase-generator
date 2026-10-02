const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const loginUrl = 'https://sts-frontend-gold.vercel.app/login';
  const profileUrl = 'https://sts-frontend-gold.vercel.app/profile';

  console.log('Navigating to login...');
  await page.goto(loginUrl);
  await page.waitForLoadState('networkidle');

  for (let attempt = 0; attempt < 6; attempt++) {
    if (page.url().includes('/login')) {
      const userInput = page.getByPlaceholder('กรอกชื่อผู้ใช้งาน');
      await userInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await userInput.fill('council.admin');
      const passInput = page.getByPlaceholder('กรอกรหัสผ่าน');
      await passInput.fill('11111111');
      await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

      const navPromise = page.waitForURL((url) => !url.pathname.includes('/login'), {
        waitUntil: 'domcontentloaded',
        timeout: 8000,
      }).then(() => 'success').catch(() => null);

      const rateLimitPromise = page.waitForSelector('text=คำขอมากเกินไป', {
        timeout: 3000,
      }).then(() => 'ratelimit').catch(() => null);

      const outcome = await Promise.race([navPromise, rateLimitPromise]);
      if (outcome === 'success') {
        console.log('Login success!');
        await page.waitForSelector('header, aside', { timeout: 15000 }).catch(() => {});
        break;
      }
      if (outcome === 'ratelimit') {
        console.log('Rate limited, waiting 15s...');
        await page.waitForTimeout(15000);
      } else {
        console.log('Retrying login attempt...');
        await page.waitForTimeout(3000);
      }
    } else {
      break;
    }
  }

  console.log('Navigating to profile URL:', profileUrl);
  await page.goto(profileUrl);
  await page.waitForLoadState('networkidle');

  const bellBtn = page.locator('button[aria-controls="notification-center"]').or(
    page.getByRole('button', { name: /รายการแจ้งเตือน/i })
  ).first();

  console.log('Bell button visible:', await bellBtn.isVisible({ timeout: 10000 }));
  if (await bellBtn.isVisible()) {
    await bellBtn.click();
    await page.waitForTimeout(1000);
    const box = page.locator('#notification-center').or(page.getByText(/การแจ้งเตือน|แจ้งเตือน/i).first());
    console.log('Notification box visible:', await box.isVisible());
  }

  await browser.close();
})();
