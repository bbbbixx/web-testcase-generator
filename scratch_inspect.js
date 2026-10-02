const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const loginUrl = 'https://sts-frontend-gold.vercel.app/login';
  const profileUrl = 'https://sts-frontend-gold.vercel.app/profile';

  console.log('Navigating to login...');
  await page.goto(loginUrl);
  await page.waitForLoadState('networkidle');

  await page.getByPlaceholder('กรอกชื่อผู้ใช้งาน').fill('burapha.director');
  await page.getByPlaceholder('กรอกรหัสผ่าน').fill('11111111');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

  await page.waitForTimeout(4000);
  console.log('Navigating to profile...');
  await page.goto(profileUrl);
  await page.waitForLoadState('networkidle');

  const editBtn = page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i });
  if (await editBtn.isVisible()) {
    console.log('Clicking "แก้ไขข้อมูลส่วนตัว"...');
    await editBtn.click();
    await page.waitForTimeout(2000);

    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons in Edit Mode:`);
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].innerText().catch(() => '');
      const type = await buttons[i].getAttribute('type').catch(() => '');
      const visible = await buttons[i].isVisible();
      const disabled = await buttons[i].isDisabled();
      const outerHTML = await buttons[i].evaluate(el => el.outerHTML).catch(() => '');
      console.log(`Button [${i}]: text="${text.trim()}", type="${type}", visible=${visible}, disabled=${disabled}`);
      console.log(`   HTML: ${outerHTML.slice(0, 150)}`);
    }
  } else {
    console.log('Edit profile button not visible! Current URL:', page.url());
  }

  await browser.close();
})();
