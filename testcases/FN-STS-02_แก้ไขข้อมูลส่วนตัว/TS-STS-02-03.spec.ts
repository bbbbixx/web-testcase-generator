import { test, expect } from '@playwright/test';

/**
 * ฟังก์ชัน: FN-STS-02 แก้ไขข้อมูลส่วนตัว
 * ชุดทดสอบ: TS-STS-02-03 ตรวจสอบการแสดงผล (Display & Role Permissions)
 */
test.describe('FN-STS-02 แก้ไขข้อมูลส่วนตัว - TS-STS-02-03 ตรวจสอบการแสดงผล', () => {
  const loginUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/login` : 'https://sts-frontend-gold.vercel.app/login';
  const profileUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/profile` : 'https://sts-frontend-gold.vercel.app/profile';

  async function performLogin(page: any, user: string, pass: string) {
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

  test('TC-STS-02-03-01: ตรวจสอบการแสดงผลฟิลด์ Read-only ของชื่อผู้ใช้งานและสังกัด', async ({ page }) => {
    await performLogin(page, 'burapha.director', '11111111');
    await page.goto(profileUrl);
    await page.waitForLoadState('networkidle');

    // 1. ตรวจสอบข้อความแนะนำ Read-only
    await expect(page.getByText(/แก้ไขไม่ได้ด้วยตนเอง/i).first()).toBeVisible({ timeout: 10000 });

    // 2. เข้าโหมดแก้ไข และตรวจสอบว่า username และ affiliation เป็น disabled / read-only
    await page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i }).click();
    await expect(page.locator('#username')).toBeDisabled();
    await expect(page.locator('#affiliation')).toBeDisabled();

    await page.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  });

  test('TC-STS-02-03-02: ตรวจสอบการแสดงผลตำแหน่ง สังกัด และขอบเขตข้อมูลของผู้อำนวยการ', async ({ page }) => {
    await performLogin(page, 'burapha.director', '11111111');
    await page.goto(profileUrl);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/ผู้อำนวยการ/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/โรงเรียนบูรพา/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-02-03-03: ตรวจสอบการแสดงผลตำแหน่งและสังกัดระดับสภาของผู้บริหาร', async ({ page }) => {
    await performLogin(page, 'council.executive', '11111111');
    await page.goto(profileUrl);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/ผู้บริหาร/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-02-03-04: ตรวจสอบการแสดงผลตำแหน่งและสังกัดของแอดมินระดับโรงเรียน', async ({ page }) => {
    await performLogin(page, 'burapha.admin', '11111111');
    await page.goto(profileUrl);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/โรงเรียนบูรพา/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/ผู้ดูแลระบบโรงเรียน/i).or(page.getByText(/ผู้ดูแลระบบ/i)).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-02-03-05: ตรวจสอบการแสดงผลตำแหน่งและสิทธิ์ระดับสภาของแอดมินสภา', async ({ page }) => {
    await performLogin(page, 'council.admin', '11111111');
    await page.goto(profileUrl);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/ผู้ดูแลระบบ/i).first()).toBeVisible({ timeout: 10000 });
  });
});
