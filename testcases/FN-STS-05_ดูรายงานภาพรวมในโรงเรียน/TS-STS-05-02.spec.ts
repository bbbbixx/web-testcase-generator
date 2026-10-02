import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-05 ดูรายงานภาพรวมในโรงเรียน
 * หน้าจอ: SC-STS-05-01 หน้าจอรายงานภาพรวมในโรงเรียน (School Overview Dashboard)
 * ชุดทดสอบ: TS-STS-05-02 ตรวจสอบการทำงานของปุ่มและการนำทาง (Buttons & Navigation)
 */
test.describe('FN-STS-05 ดูรายงานภาพรวมในโรงเรียน - TS-STS-05-02 ตรวจสอบการทำงานของปุ่มและการนำทาง', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');
  });

  test('TC-STS-05-02-01: ตรวจสอบการคลิกการ์ด KPI "เสี่ยงสูง" เพื่อนำทางไปยังหน้ารายงานสถานะนักเรียนกลุ่มเสี่ยง', async ({ page }) => {
    // 1. อยู่ที่หน้าแดชบอร์ดหลัก
    // 2. คลิกที่การ์ด KPI "นักเรียนกลุ่มเสี่ยง" / "เสี่ยงสูง"
    const highRiskCard = page.getByText(/นักเรียนกลุ่มเสี่ยง|เสี่ยงสูง/i).first();
    await expect(highRiskCard).toBeVisible({ timeout: 10000 });
    await highRiskCard.click();
    await page.waitForTimeout(500);

    // Expected: ระบบนำทางเข้าสู่หน้ารายงานสถานะนักเรียน (/student-risk-report) พร้อมกรองเฉพาะกลุ่มเสี่ยงสูง
    await expect(page).toHaveURL(/.*student-risk-report.*/i);
    await expect(page).toHaveURL(/.*HIGH|riskTier|student.*/i);
  });

  test('TC-STS-05-02-02: ตรวจสอบการคลิกการ์ด KPI "เฝ้าระวัง" เพื่อนำทางไปยังหน้ารายงานสถานะนักเรียนกลุ่มเฝ้าระวัง', async ({ page }) => {
    // 1. อยู่ที่หน้าแดชบอร์ดหลัก
    // 2. คลิกที่การ์ด KPI "เฝ้าระวัง" / "กลุ่มเฝ้าระวัง"
    const watchlistCard = page.getByText(/เฝ้าระวัง/i).first();
    await expect(watchlistCard).toBeVisible(); if (await watchlistCard.isVisible()) {
      await watchlistCard.click();
      await page.waitForTimeout(500);
    }

    // Expected: ระบบนำทางเข้าสู่หน้ารายงานสถานะนักเรียน (/student-risk-report) ทันที
    await expect(page).toHaveURL(/.*student-risk-report.*/i);
  });

  test('TC-STS-05-02-03: ตรวจสอบการคลิกปุ่มดูรายละเอียดในส่วน "เคสที่กำลังดำเนินการ"', async ({ page }) => {
    // 1. ที่กล่องสรุปเคส คลิกที่ตัวเลข "เปิดเคส" หรือ "เคสที่กำลังดำเนินการ"
    const caseBtn = page.getByText(/เปิดเคส|เคสที่กำลังดำเนินการ|รอพิจารณา/i).first();
    await expect(caseBtn).toBeVisible({ timeout: 10000 });
    await caseBtn.click();
    await page.waitForTimeout(500);

    // Expected: ระบบนำทางเข้าสู่หน้ารายงานเคส (/student-risk-report/risk?caseStatus=OPEN)
    await expect(page).toHaveURL(/.*student-risk-report.*caseStatus.*/i);
  });

  test('TC-STS-05-02-04: ตรวจสอบการคลิกสลับแท็บ "ปัญหาที่พบ" ในส่วนภาพรวมความเสี่ยง', async ({ page }) => {
    // 1. เลื่อนลงมาที่ส่วนภาพรวมความเสี่ยงจากผลการติดตาม
    // 2. คลิกแท็บ "ปัญหาที่พบ"
    const tabIssues = page.getByRole('tab', { name: /ปัญหาที่พบ/i });
    await expect(tabIssues).toBeVisible({ timeout: 10000 });
    await tabIssues.click();
    await page.waitForTimeout(300);

    // Expected: แท็บ "ปัญหาที่พบ" อยู่ในสถานะ active (aria-selected="true") และแสดงสถิติประเภทปัญหาที่พบในนักเรียน
    await expect(tabIssues).toHaveAttribute('aria-selected', 'true');
    const problemText = page.getByText(/ประเภทปัญหาที่พบในนักเรียน|สาเหตุการขาดเรียน/i).first();
    await expect(problemText).toBeVisible();
  });

  test('TC-STS-05-02-05: ตรวจสอบการคลิกสลับแท็บ "การติดตาม" ในส่วนภาพรวมความเสี่ยง', async ({ page }) => {
    // 1. คลิกแท็บ "การติดตาม"
    const tabTracking = page.getByRole('tab', { name: /การติดตาม/i });
    await expect(tabTracking).toBeVisible({ timeout: 10000 });
    await tabTracking.click();
    await page.waitForTimeout(300);

    // Expected: แท็บ "การติดตาม" อยู่ในสถานะ active (aria-selected="true") และแสดงสถิติระดับความห่วงใยจากครูประจำชั้น
    await expect(tabTracking).toHaveAttribute('aria-selected', 'true');
    const trackingText = page.getByText(/ระดับความห่วงใยจากครูประจำชั้น|การส่งต่อหน่วยงาน|เหตุที่ติดตามไม่สำเร็จ/i).first();
    await expect(trackingText).toBeVisible();
  });

  test('TC-STS-05-02-06: ตรวจสอบการคลิกสลับแท็บ "ผลลัพธ์" ในส่วนภาพรวมความเสี่ยง', async ({ page }) => {
    // 1. คลิกแท็บ "ผลลัพธ์"
    const tabResults = page.getByRole('tab', { name: /ผลลัพธ์/i });
    await expect(tabResults).toBeVisible({ timeout: 10000 });
    await tabResults.click();
    await page.waitForTimeout(300);

    // Expected: แท็บ "ผลลัพธ์" อยู่ในสถานะ active (aria-selected="true") และแสดงกราฟผลปลายทางของแต่ละประเภทปัญหา
    await expect(tabResults).toHaveAttribute('aria-selected', 'true');
    const resultsText = page.getByText(/ผลปลายทางของแต่ละประเภทปัญหา|เคสเปิดใหม่เทียบที่ช่วยสำเร็จ/i).first();
    await expect(resultsText).toBeVisible();
  });

  test('TC-STS-05-02-07: ตรวจสอบการคลิกเปิด/ปิดเมนู Dropdown โปรไฟล์ผู้ใช้งานที่แถบด้านบนขวา', async ({ page }) => {
    // 1. คลิกที่ปุ่มโปรไฟล์ผู้ใช้งานมุมขวาบน
    const profileBtn = page.locator('button[aria-controls="header-profile-menu"]').or(page.getByRole('button', { name: /เปิดเมนูบัญชีผู้ใช้/i })).first();
    await expect(profileBtn).toBeVisible({ timeout: 10000 });
    await profileBtn.click();

    // 2. ตรวจสอบเมนูที่ปรากฏ
    const profileMenu = page.locator('#header-profile-menu');
    await expect(profileMenu).toBeVisible({ timeout: 5000 });
    await expect(profileMenu).toContainText(/สังกัด|ตำแหน่ง|โปรไฟล์/i);
    const logoutItem = profileMenu.locator('button, [role="menuitem"]').filter({ hasText: /ออกจากระบบ/i }).first();
    await expect(logoutItem).toBeVisible();

    // 3. คลิกพื้นที่ว่างเพื่อปิด
    await page.mouse.click(10, 10);
    await page.waitForTimeout(300);

    // Expected: Dropdown ปิดลงอย่างราบรื่น
    await expect(profileMenu).not.toBeVisible();
  });

  test('TC-STS-05-02-08: ตรวจสอบการคลิกปุ่ม "ออกจากระบบ" (Logout) ใน Dropdown โปรไฟล์', async ({ page }) => {
    // 1. เปิด Dropdown โปรไฟล์
    const profileBtn = page.locator('button[aria-controls="header-profile-menu"]').or(page.getByRole('button', { name: /เปิดเมนูบัญชีผู้ใช้/i })).first();
    await expect(profileBtn).toBeVisible({ timeout: 10000 });
    await profileBtn.click();

    // รอดร็อปดาวน์เมนูปรากฏ
    const profileMenu = page.locator('#header-profile-menu');
    await expect(profileMenu).toBeVisible({ timeout: 5000 });

    // 2. คลิกปุ่ม "ออกจากระบบ"
    const logoutBtn = profileMenu.locator('button, [role="menuitem"]').filter({ hasText: /ออกจากระบบ/i }).first();
    await expect(logoutBtn).toBeVisible({ timeout: 5000 });
    await logoutBtn.click();

    // Expected: ระบบทำการเคลียร์เซสชันและนำทางกลับไปยังหน้าเข้าสู่ระบบ (/login) ทันที
    await expect(page).toHaveURL(/.*login.*/, { timeout: 10000 });
  });
});
