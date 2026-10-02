import { test, expect } from '@playwright/test';

/**
 * ฟังก์ชัน: FN-STS-01 เข้าสู่ระบบ
 * หน้าจอ: SC-STS-01-01 หน้าจอเข้าสู่ระบบ (/login)
 * ชุดทดสอบ: TS-STS-01-01 ตรวจสอบการกรอกข้อมูลและข้อกำหนดของฟิลด์ (Input Fields & Limits)
 */
test.describe('FN-STS-01 - TS-STS-01-01 ตรวจสอบการกรอกข้อมูลและข้อกำหนดของฟิลด์', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-STS-01-01-01: ตรวจสอบการกรอกข้อมูล Text Username รองรับทั้งตัวอักษรและตัวเลข', async ({ page }) => {
    // 1. อยู่ที่หน้าเข้าสู่ระบบ
    const userInput = page.getByPlaceholder('กรอกชื่อผู้ใช้งาน');
    await expect(userInput).toBeVisible();

    // 2. กรอกข้อความ "newnew"
    await userInput.fill('newnew');
    await page.mouse.click(10, 10);

    // Expected: สามารถกรอกข้อมูลตัวอักษรลงในช่องชื่อผู้ใช้งานได้อย่างถูกต้อง
    await expect(userInput).toHaveValue('newnew');
  });

  test('TC-STS-01-01-02: ตรวจสอบการกรอกข้อมูล Text Password แสดงผลซ่อนเป็น ●●●', async ({ page }) => {
    // 1. อยู่ที่หน้าเข้าสู่ระบบ
    const passInput = page.getByPlaceholder('กรอกรหัสผ่าน');
    await expect(passInput).toBeVisible();

    // 2. กรอกข้อมูล "11111111"
    await passInput.fill('11111111');
    await page.mouse.click(10, 10);

    // Expected: ช่องรหัสผ่านเป็น type="password" (แสดงผลซ่อนเป็นจุด ●●●)
    await expect(passInput).toHaveAttribute('type', 'password');
    await expect(passInput).toHaveValue('11111111');
  });

  test('TC-STS-01-01-03: ตรวจสอบการกรอกข้อมูล Text Username โดยจะต้องสามารถกรอกข้อความได้ไม่เกิน 50 ตัวอักษร', async ({ page }) => {
    // 1. อยู่ที่หน้าเข้าสู่ระบบ
    const userInput = page.getByPlaceholder('กรอกชื่อผู้ใช้งาน');
    await expect(userInput).toBeVisible();

    // Expected Result ตามเอกสาร: ไม่สามารถกรอกข้อความได้เกิน 50 ตัวอักษร
    await userInput.fill('a'.repeat(60));
    expect((await userInput.inputValue()).length).toBeLessThanOrEqual(50);
  });

  test('TC-STS-01-01-04: ตรวจสอบการกรอกข้อมูล Text Password โดยจะต้องสามารถกรอกข้อความได้ไม่เกิน 50 ตัวอักษร', async ({ page }) => {
    // 1. อยู่ที่หน้าเข้าสู่ระบบ
    const passInput = page.getByPlaceholder('กรอกรหัสผ่าน');
    await expect(passInput).toBeVisible();

    // Expected Result ตามเอกสาร: ไม่สามารถกรอกข้อความได้เกิน 50 ตัวอักษร
    await passInput.fill('a'.repeat(60));
    expect((await passInput.inputValue()).length).toBeLessThanOrEqual(50);
  });
});
