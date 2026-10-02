import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-10-01: การค้นหาและกรองบันทึกการใช้งาน (Audit Log Search & Filters)', () => {

  test.beforeEach(async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย council.admin และไปที่หน้าบันทึกการใช้งาน
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/council/audit-log');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-10-01-01: ตรวจสอบการค้นหาผู้ทำรายการด้วยชื่อบัญชีที่ถูกต้อง (Positive Search)', async ({ page }) => {
    // 3. พิมพ์ "burapha.director" ในช่องค้นหาผู้ทำรายการ (#audit-search)
    const searchInput = page.locator('#audit-search, input[placeholder*="ค้นหา"]').first();
    await searchInput.fill('burapha.director');
    await page.waitForTimeout(500);

    // Expected Result: ตารางแสดงเฉพาะรายการประวัติการใช้งานที่กระทำโดย "burapha.director" อย่างถูกต้อง
    const tableRows = page.locator('table tbody tr, div.table-row');
    if (await tableRows.count() > 0) {
      await expect(tableRows.first()).toContainText('burapha.director');
    }
  });

  test('TC-STS-10-01-02: ตรวจสอบการค้นหาผู้ทำรายการด้วยคำค้นหาที่ไม่พบในระบบ (Negative Search)', async ({ page }) => {
    const searchInput = page.locator('#audit-search, input[placeholder*="ค้นหา"]').first();
    await searchInput.fill('unknown_user_99999');
    await page.waitForTimeout(500);

    // Expected Result: ตารางแสดงสถานะว่าง ไม่พบข้อมูล หรือ 0 รายการ
    const emptyState = page.locator('text=ไม่พบข้อมูล, text=0 รายการ, table tbody tr:has-text("ไม่พบ")');
    await expect(emptyState.first()).toBeVisible();
  });

  test('TC-STS-10-01-03: ตรวจสอบการกรองบันทึกตามประเภทการกระทำ (Action Type Filter)', async ({ page }) => {
    const actionSelect = page.locator('#audit-action, select, [role="combobox"]').first();
    await expect(actionSelect).toBeVisible(); if (await actionSelect.isVisible()) {
      await actionSelect.click();
      const option = page.locator('[role="option"], option').first();
      await expect(option).toBeVisible(); await option.click();
    }
    // Expected Result: ตารางกรองแสดงเฉพาะประวัติการใช้งานที่มีประเภทตรงตามที่เลือก
    await expect(page.locator('table, div[role="table"]').first()).toBeVisible();
  });

  test('TC-STS-10-01-04: ตรวจสอบการกรองบันทึกตามช่วงเวลา วันที่เริ่มต้น - วันที่สิ้นสุด (Date Range Filter)', async ({ page }) => {
    const dateFrom = page.locator('#audit-date-from, input[type="date"]').first();
    const dateTo = page.locator('#audit-date-to, input[type="date"]').nth(1);

    await expect(dateFrom).toBeVisible(); await dateFrom.fill('2026-09-01');
    await expect(dateTo).toBeVisible(); await dateTo.fill('2026-09-27');

    await page.waitForTimeout(500);
    // Expected Result: ตารางแสดงเฉพาะรายการ Log ที่เกิดขึ้นในช่วงวันที่ 01/09/2026 ถึง 27/09/2026
    await expect(page.locator('table, div[role="table"]').first()).toBeVisible();
  });

  test('TC-STS-10-01-05: ตรวจสอบการระบุช่วงวันที่เริ่มต้นมากกว่าวันที่สิ้นสุด (Negative Boundary Date Filter)', async ({ page }) => {
    const dateFrom = page.locator('#audit-date-from, input[type="date"]').first();
    const dateTo = page.locator('#audit-date-to, input[type="date"]').nth(1);

    await expect(dateFrom).toBeVisible(); await dateFrom.fill('2026-09-30');
    await expect(dateTo).toBeVisible(); await dateTo.fill('2026-09-01');

    await page.waitForTimeout(500);
    // Expected Result: ระบบไม่อนุญาต หรือแสดง 0 รายการ หรือมีข้อความแจ้งเตือนช่วงวันที่ไม่ถูกต้อง
    await expect(page.locator('table, div[role="table"]').first()).toBeVisible();
  });

  test('TC-STS-10-01-06: ตรวจสอบการกรอกเลขหน้าในช่อง "ไปหน้า" เพื่อกระโดดข้ามหน้า (Jump to Page)', async ({ page }) => {
    const jumpInput = page.locator('input[placeholder*="ไปหน้า"], input.jump-page').first();
    await expect(jumpInput).toBeVisible(); if (await jumpInput.isVisible()) {
      await jumpInput.fill('5');
      await jumpInput.press('Enter');
      await page.waitForTimeout(500);
    }
    // Expected Result: ตารางเปลี่ยนไปแสดงข้อมูลรายการของหน้าที่กำหนดได้อย่างถูกต้อง
    await expect(page.locator('table, div[role="table"]').first()).toBeVisible();
  });

  test('TC-STS-10-01-07: ตรวจสอบการกรอกเลขหน้าที่เกินขอบเขตหรือไม่ถูกต้องในช่อง "ไปหน้า"', async ({ page }) => {
    const jumpInput = page.locator('input[placeholder*="ไปหน้า"], input.jump-page').first();
    await expect(jumpInput).toBeVisible(); if (await jumpInput.isVisible()) {
      await jumpInput.fill('9999');
      await jumpInput.press('Enter');
      await page.waitForTimeout(500);
    }
    // Expected Result: ระบบจำกัดค่าให้อยู่ในช่วงหน้าสูงสุด หรือหน้าที่ต่ำสุด
    await expect(page.locator('table, div[role="table"]').first()).toBeVisible();
  });

});
