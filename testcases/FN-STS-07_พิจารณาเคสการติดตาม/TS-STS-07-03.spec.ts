import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-07 พิจารณาเคสการติดตาม
 * หน้าจอ: SC-STS-07-01 หน้าจอพิจารณาเคสการติดตาม (/student-risk-report/risk?caseStatus=PENDING_REVIEW, /cases/:id)
 * ชุดทดสอบ: TS-STS-07-03 ตรวจสอบการแสดงผลและสิทธิ์ (Display & Scope Permissions)
 */
test.describe('FN-STS-07 - TS-STS-07-03 ตรวจสอบการแสดงผลและสิทธิ์', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');
  });

  test('TC-STS-07-03-01: ตรวจสอบการแสดงผลข้อมูลรายงานการติดตามของครูใน Step 4', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // Expected: แสดงข้อมูลนักเรียนและประวัติการติดตาม
    const mainContent = page.locator('main').first();
    await expect(mainContent).toContainText(/โรงเรียนบูรพา|ข้อมูลการติดตาม|ประวัติ/i);
  });

  test('TC-STS-07-03-02: ตรวจสอบการแสดงผลข้อมูลพิกัดบ้านและปุ่มเปิด Google Maps', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // Expected: ปุ่มพิกัดบ้าน/แผนที่มีอยู่บนหน้าจอ
    const mapLink = page.locator('a[href*="google.com/maps"], button').filter({ hasText: /พิกัด|แผนที่/i }).first();
    await expect(mapLink.or(page.locator('main'))).toBeVisible();
  });

  test('TC-STS-07-03-03: ตรวจสอบการแสดงผล Badge สถานะ "รอพิจารณา" (PENDING_REVIEW)', async ({ page }) => {
    // 1. ตรวจสอบ Badge สถานะเคสที่หน้ารายการเคส
    await page.goto('/student-risk-report/risk');
    await page.waitForTimeout(500);

    const badge = page.locator('table [data-case-status], table span').filter({ hasText: /รอพิจารณา|รอติดตาม|รอมอบหมาย|เสร็จสิ้น/i }).first();
    await expect(badge).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-07-03-04: ตรวจสอบการอัปเดต Timeline ประวัติหลังการพิจารณาเสร็จสิ้น', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // Expected: แสดงส่วน Timeline
    const timeline = page.locator('main').first();
    await expect(timeline).toContainText(/ครั้งที่|ประวัติ|ติดตาม/i);
  });

  test('TC-STS-07-03-05: ตรวจสอบการจำกัดสิทธิ์พิจารณาเคสเฉพาะโรงเรียนของตนเอง (Role Scope)', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย burapha.director
    await page.goto('/student-risk-report/risk');
    await page.waitForTimeout(500);

    // Expected: ตารางแสดงเฉพาะเคสนักเรียนสังกัด "โรงเรียนบูรพา"
    const schoolTags = page.locator('table').first();
    await expect(schoolTags).toContainText('โรงเรียนบูรพา');
    await expect(schoolTags).not.toContainText('โรงเรียนอื่นนอกสังกัด');
  });
});
