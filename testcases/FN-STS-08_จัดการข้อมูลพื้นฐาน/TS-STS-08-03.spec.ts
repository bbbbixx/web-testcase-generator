import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-08-03: การเข้าถึงหน้าและการแสดงผลข้อมูลพื้นฐาน', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/master-data');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-08-03-01: ตรวจสอบการเข้าถึงหน้า "ข้อมูลพื้นฐาน" สำเร็จ', async ({ page }) => {
    // Expected Result: แสดงหน้า "ข้อมูลพื้นฐาน" พร้อม Dropdown เลือกประเภทข้อมูล, ตารางแสดงรายการ และปุ่ม "เพิ่มรายการ"
    await expect(page).toHaveURL(/\/master-data/);
    
    // ตรวจสอบองค์ประกอบในหน้า
    const dropdown = page.locator('select, [role="combobox"]').first();
    await expect(dropdown).toBeVisible();

    const addBtn = page.locator('button:has-text("เพิ่มรายการ")').first();
    await expect(addBtn).toBeVisible();

    const table = page.locator('table, div[role="table"], div.table-container').first();
    await expect(table).toBeVisible();
  });

  test('TC-STS-08-03-02: ตรวจสอบการเลือกประเภทข้อมูลจาก Dropdown แล้วแสดงข้อมูลในตารางตรงตามประเภทที่เลือก', async ({ page }) => {
    // 1. เข้าสู่หน้า "จัดการข้อมูลพื้นฐาน"
    // 2. คลิก Dropdown เลือกประเภทข้อมูลพื้นฐาน
    // 3. เลือก "ประเภทการขาด"
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    // Expected Result: ตารางแสดงข้อมูลรายการที่เป็นประเภท "ประเภทการขาด" โดยมีคอลัมน์: ลำดับ, รหัส, ชื่อภาษาไทย, ลำดับแสดงผล, สถานะ, จัดการ
    const tableHeader = page.locator('table thead, div.table-header').first();
    await expect(tableHeader).toBeVisible();
    await expect(tableHeader).toContainText('ลำดับ');
    await expect(tableHeader).toContainText('รหัส');
    await expect(tableHeader).toContainText('ชื่อ');
    await expect(tableHeader).toContainText('สถานะ');
    await expect(tableHeader).toContainText('จัดการ');
  });

});
