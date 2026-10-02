import { expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_DIR = path.resolve(__dirname, '../../.auth');

export async function performLogin(page: Page, user: string, pass: string) {
  const loginUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/login` : 'https://sts-frontend-gold.vercel.app/login';

  await page.goto(loginUrl);
  await page.waitForLoadState('networkidle');

  for (let attempt = 0; attempt < 6; attempt++) {
    if (page.url().includes('/login')) {
      const userInput = page.getByPlaceholder('กรอกชื่อผู้ใช้งาน');
      await userInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await userInput.fill(user);
      const passInput = page.getByPlaceholder('กรอกรหัสผ่าน');
      await passInput.fill(pass);
      await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

      const navPromise = page.waitForURL((url: URL) => !url.pathname.includes('/login'), {
        waitUntil: 'domcontentloaded',
        timeout: 8000,
      }).then(() => 'success').catch(() => null);

      const rateLimitPromise = page.waitForSelector('text=คำขอมากเกินไป', {
        timeout: 3000,
      }).then(() => 'ratelimit').catch(() => null);

      const outcome = await Promise.race([navPromise, rateLimitPromise]);
      if (outcome === 'success') {
        await page.waitForSelector('header, aside', { timeout: 15000 }).catch(() => {});
        return;
      }
      if (outcome === 'ratelimit') {
        await page.waitForTimeout(15000);
      } else {
        await page.waitForTimeout(3000);
      }
    } else {
      return;
    }
  }
  await expect(page).not.toHaveURL(/.*login.*/, { timeout: 15000 });
}

/**
 * ล็อกอินและบันทึก/ใช้ Session เดิม (StorageState) เพื่อป้องกัน Rate Limit
 */
export async function loginWithSession(page: Page, user: string, pass: string) {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const authFile = path.join(AUTH_DIR, `${user}.json`);
  const baseUrl = process.env.BASE_URL || 'https://sts-frontend-gold.vercel.app';

  // 1. ถ้ามีไฟล์ Session เดิม ลองโหลดคุกกี้/StorageState มาใช้งาน
  if (fs.existsSync(authFile)) {
    try {
      const state = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
      const hasCookies = Array.isArray(state.cookies) && state.cookies.length > 0;
      const hasLocalStorage = Array.isArray(state.origins)
        && state.origins.some((origin: { localStorage?: unknown[] }) => Array.isArray(origin.localStorage) && origin.localStorage.length > 0);

      if (!hasCookies && !hasLocalStorage) {
        throw new Error('Session state contains neither cookies nor localStorage');
      }

      if (hasCookies) await page.context().addCookies(state.cookies);
      if (hasLocalStorage) {
        await page.context().addInitScript((origins: Array<{ origin: string; localStorage?: Array<{ name: string; value: string }> }>) => {
          const currentOrigin = origins.find((origin) => origin.origin === window.location.origin);
          for (const item of currentOrigin?.localStorage ?? []) {
            window.localStorage.setItem(item.name, item.value);
          }
        }, state.origins);
      }
      await page.goto(baseUrl);
      await page.waitForLoadState('domcontentloaded');

      // ตรวจสอบว่าเข้าหน้าหลักได้สำเร็จโดยไม่ต้องย้ายไป /login หรือไม่
      if (!page.url().includes('/login')) {
        return; // ใช้ Session สำเร็จ! ไม่ต้องส่ง Request ล็อกอินใหม่
      }
    } catch (e) {
      // Session หมดอายุหรือไฟล์เสีย ให้ทำการล็อกอินใหม่ด้านล่าง
    }
  }

  // 2. ถ้ายังไม่มี Session หรือ Session หมดอายุ ทำการล็อกอินและบันทึก Session ใหม่
  await performLogin(page, user, pass);
  await page.context().storageState({ path: authFile });
}
