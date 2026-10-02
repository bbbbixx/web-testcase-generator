import { test, expect } from '@playwright/test';

/**
 * ฟังก์ชัน: FN-STS-02 แก้ไขข้อมูลส่วนตัว
 * หน้าจอ: SC-STS-02-01 ตรวจสอบหน้าจอแก้ไขข้อมูลส่วนตัว
 * ชุดทดสอบ: TS-STS-02-02 ตรวจสอบการทำงานของปุ่ม (Buttons & Actions)
 */
test.describe('FN-STS-02 แก้ไขข้อมูลส่วนตัว - TS-STS-02-02 ตรวจสอบการทำงานของปุ่ม', () => {
  const loginUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/login` : 'https://sts-frontend-gold.vercel.app/login';
  const profileUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/profile` : 'https://sts-frontend-gold.vercel.app/profile';
  const changePasswordUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/change-password` : 'https://sts-frontend-gold.vercel.app/change-password';

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

  test.beforeEach(async ({ page }) => {
    await performLogin(page, 'burapha.director', '11111111');
    await page.goto(profileUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=ข้อมูลทั่วไป', { timeout: 15000 }).catch(() => {});
  });

  test('TC-STS-02-02-01: ตรวจสอบการทำงานของปุ่ม "แก้ไขข้อมูลส่วนตัว" เพื่อเปิดโหมดแก้ไข', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i });
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    await expect(page.getByRole('button', { name: 'บันทึก', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ยกเลิก', exact: true })).toBeVisible();
    await expect(page.locator('#FirstName')).toBeEditable();

    await page.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  });

  test('TC-STS-02-02-02: ตรวจสอบการทำงานของปุ่ม "แสดงเลขบัตร" และ "ซ่อนเลขบัตร"', async ({ page }) => {
    const showIdBtn = page.getByRole('button', { name: /แสดงเลขบัตร/i }).first();
    await expect(showIdBtn).toBeVisible({ timeout: 10000 });
    await showIdBtn.click();

    const hideIdBtn = page.getByRole('button', { name: /ซ่อนเลขบัตร/i }).first();
    await expect(hideIdBtn).toBeVisible({ timeout: 10000 });

    await hideIdBtn.click();
    await expect(page.getByRole('button', { name: /แสดงเลขบัตร/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-02-02-03: ตรวจสอบการทำงานของปุ่ม "เปลี่ยนรหัสผ่าน"', async ({ page }) => {
    const changePwdBtn = page.getByRole('button', { name: 'เปลี่ยนรหัสผ่าน', exact: true });
    await expect(changePwdBtn).toBeVisible({ timeout: 10000 });
    await changePwdBtn.click();

    await expect(page).toHaveURL(/.*change-password/);
  });

  test('TC-STS-02-02-04: ตรวจสอบการทำงานของปุ่ม "กลับโปรไฟล์" ในหน้าเปลี่ยนรหัสผ่าน', async ({ page }) => {
    await page.goto(changePasswordUrl);
    await page.waitForLoadState('networkidle');

    const backBtn = page.getByRole('button', { name: /กลับโปรไฟล์/i }).first();
    await expect(backBtn).toBeVisible({ timeout: 10000 });
    await backBtn.click();

    await expect(page).toHaveURL(/.*profile/);
  });

  test('TC-STS-02-02-05: ตรวจสอบการทำงานของปุ่ม "ยกเลิก" ในโหมดแก้ไขข้อมูล', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i });
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    const now = Date.now().toString().slice(-4);
    const initialFirstName = await page.locator('#FirstName').inputValue();
    await page.locator('#FirstName').fill(`ทดสอบ${now}`);

    const cancelBtn = page.getByRole('button', { name: 'ยกเลิก', exact: true });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    await expect(editBtn).toBeVisible();

    await editBtn.click();
    await expect(page.locator('#FirstName')).toHaveValue(initialFirstName);
    await page.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  });

  test('TC-STS-02-02-06: ตรวจสอบการเข้าถึงโปรไฟล์จาก Dropdown Header เมนู "โปรไฟล์ของฉัน"', async ({ page }) => {
    await page.locator('header').waitFor({ state: 'visible', timeout: 15000 });
    const avatarBtn = page.locator('header button').last();
    await expect(avatarBtn).toBeVisible({ timeout: 10000 });
    await avatarBtn.click();

    const profileItem = page.getByRole('menuitem', { name: /โปรไฟล์ของฉัน/i }).or(page.getByText('โปรไฟล์ของฉัน').first());
    await expect(profileItem).toBeVisible({ timeout: 10000 });
    await profileItem.click();

    await expect(page).toHaveURL(/.*profile/);
  });
});
