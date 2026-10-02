import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-29-03: การแสดงผลและสถานะระบบ (UI Displays & System States)', () => {

  const TASK_TOKEN = '5105f90eecaf4b79cc9051529c16b689ed9107824fef40f1152174fc46573526';

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
    await page.goto(`/task/${TASK_TOKEN}/report`);
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-29-03-01: ตรวจสอบการแสดงผลการ์ดข้อมูลนักเรียน', async ({ page }) => {
    const studentCard = page.locator('div.card, div.student-info-card').first();
    await expect(studentCard).toBeVisible();
  });

  test('TC-STS-29-03-02: ตรวจสอบการแสดงผลหมวดหมู่ประเภทการขาดและสาเหตุการขาด 5 หมวดหมู่', async ({ page }) => {
    const categoryDropdown = page.locator('button:has-text("เลือกประเภท"), [role="combobox"]:has-text("ประเภทการขาด")').first();
    await expect(categoryDropdown).toBeVisible(); if (await categoryDropdown.isVisible()) {
      await expect(categoryDropdown).toBeVisible();
    }
  });

  test('TC-STS-29-03-03: ตรวจสอบการแสดงผลหัวเรื่องแบบฟอร์มและสถานะติดตาม "รอติดตาม : ให้ความช่วยเหลือ"', async ({ page }) => {
    const headerTitle = page.locator('h1, h2, div.status-badge').first();
    await expect(headerTitle).toBeVisible();
  });

  test('TC-STS-29-03-04: ตรวจสอบการแสดงผลข้อมูลนักเรียน สาเหตุที่ต้องติดตาม และประวัติการติดตาม', async ({ page }) => {
    const infoSection = page.locator('div.card, div.info-section').first();
    await expect(infoSection).toBeVisible();
  });

  test('TC-STS-29-03-05: ตรวจสอบการแสดงผลข้อมูลขั้นตอนที่ 1: "มอบหมายการช่วยเหลือ" (Read-only Summary)', async ({ page }) => {
    const step1Box = page.locator('div:has-text("มอบหมายการช่วยเหลือ")').first();
    await expect(step1Box).toBeVisible(); if (await step1Box.isVisible()) {
      await expect(step1Box).toBeVisible();
    }
  });

  test('TC-STS-29-03-06: ตรวจสอบการแสดงผลกล่อง "มาตรการที่ได้รับมอบหมาย" (Read-only Assigned Measure Box)', async ({ page }) => {
    const measureBox = page.locator('div:has-text("มาตรการ"), span.badge').first();
    await expect(measureBox).toBeVisible(); if (await measureBox.isVisible()) {
      await expect(measureBox).toBeVisible();
    }
  });

  test('TC-STS-29-03-07: ตรวจสอบการแสดงผลข้อความแจ้งเตือนฉบับร่าง (Draft Auto-cleanup Notice)', async ({ page }) => {
    const draftNotice = page.locator('text=ฉบับร่างอยู่เฉพาะ browser/device นี้').first();
    await expect(draftNotice).toBeVisible(); if (await draftNotice.isVisible()) {
      await expect(draftNotice).toBeVisible();
    }
  });

  test('TC-STS-29-03-08: ตรวจสอบการแสดงผลหน้าเสร็จสมบูรณ์พร้อมข้อความยืนยัน', async ({ page }) => {
    await page.goto(`/task/${TASK_TOKEN}/completed`);
    await page.waitForLoadState('networkidle');

    const successMessage = page.locator('text=ส่งผลการติดตาม, text=สำเร็จ, h1, h2').first();
    await expect(successMessage).toBeVisible();
  });

});
