import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-01 เข้าสู่ระบบ
 * หน้าจอ: SC-STS-01-01 หน้าจอเข้าสู่ระบบ (/login) & SC-STS-01-02 หน้าจอหลักหลังเข้าสู่ระบบ (/)
 * ชุดทดสอบ: TS-STS-01-02 ตรวจสอบการสิทธิ์เข้าสู่ระบบตามบทบาทต่างๆ และ Validation Error
 */
test.describe('FN-STS-01 - TS-STS-01-02 ตรวจสอบการสิทธิ์เข้าสู่ระบบตามบทบาทต่างๆ', () => {
  test('TC-STS-01-02-01: ตรวจสอบการทำงานของปุ่ม Login โดยหากกดเข้าสู่ระบบโดยที่ช่องว่างเปล่า ต้องมีข้อความแจ้งเตือน', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // 1. กดปุ่มเข้าสู่ระบบโดยเว้นว่าง
    const submitBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true });
    await submitBtn.click();
    await page.waitForTimeout(300);

    // Expected: ระบบแสดงข้อความแจ้งเตือน "กรุณากรอกชื่อผู้ใช้งาน" และ "กรุณากรอกรหัสผ่าน"
    await expect(page.getByText('กรุณากรอกชื่อผู้ใช้งาน').first()).toBeVisible();
    await expect(page.getByText('กรุณากรอกรหัสผ่าน').first()).toBeVisible();
  });

  test('TC-STS-01-02-02: ตรวจสอบการทำงานของปุ่ม Login โดยหากข้อมูลผิด ระบบต้องแจ้ง error message คือ "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // 1. กรอก Username/Password ที่ไม่ถูกต้อง
    await page.getByPlaceholder('กรอกชื่อผู้ใช้งาน').fill('invalid_user_xyz');
    await page.getByPlaceholder('กรอกรหัสผ่าน').fill('wrong_password');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await page.waitForTimeout(500);

    // Expected: ระบบแจ้ง error message คือ "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"
    await expect(page.getByText(/ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง/i).first()).toBeVisible();
  });

  test('TC-STS-01-02-03: ตรวจสอบการทำงานของปุ่ม Login โดย login ด้วย แอดมิน (ระดับสภา)', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย council.admin
    await loginWithSession(page, 'council.admin', '11111111');

    // Expected: ระบบเข้าสู่ระบบสำเร็จและนำทางไปยังหน้าจอหลัก
    await expect(page).not.toHaveURL(/.*login.*/);
  });

  test('TC-STS-01-02-04: ตรวจสอบการทำงานของปุ่ม Login โดย login ด้วย ผู้บริหาร (ระดับสภา)', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย council.executive
    await loginWithSession(page, 'council.executive', '11111111');

    // Expected: ระบบเข้าสู่ระบบสำเร็จและนำทางไปยังหน้าจอหลัก
    await expect(page).not.toHaveURL(/.*login.*/);
  });

  test('TC-STS-01-02-05: ตรวจสอบการทำงานของปุ่ม Login โดย login ด้วย ผู้อำนวยการ', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย burapha.director
    await loginWithSession(page, 'burapha.director', '11111111');

    // Expected: ระบบเข้าสู่ระบบสำเร็จและนำทางไปยังหน้าจอหลัก
    await expect(page).not.toHaveURL(/.*login.*/);
  });

  test('TC-STS-01-02-06: ตรวจสอบการทำงานของปุ่ม Login โดย login ด้วย ผู้ดูแลระบบโรงเรียน', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย burapha.admin
    await loginWithSession(page, 'burapha.admin', '11111111');

    // Expected: ระบบเข้าสู่ระบบสำเร็จและนำทางไปยังหน้าจอหลัก
    await expect(page).not.toHaveURL(/.*login.*/);
  });
});
