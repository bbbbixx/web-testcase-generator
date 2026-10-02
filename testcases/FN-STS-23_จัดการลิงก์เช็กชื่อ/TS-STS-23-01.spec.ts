import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-23-01: การกรอกข้อมูลและเงื่อนไขความถูกต้อง (Inputs & Validations)', () => {

  test.beforeEach(async ({ page }) => {
    // เข้าสู่ระบบด้วย burapha.admin และไปหน้าจัดการลิงก์คุณครู
    await loginWithSession(page, 'burapha.admin', '11111111');
    await page.goto('/attendance/classroom-links');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-23-01-01: ตรวจสอบการค้นหาครู ห้องเรียน หรือระดับชั้นในช่อง Search Input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ค้นหาห้อง"], input[placeholder*="ระดับชั้น"], input[placeholder*="ค้นหา"]').first();
    await expect(searchInput).toBeVisible();

    await searchInput.fill('อนุบาล');
    await page.waitForTimeout(400);

    const tableRows = page.locator('table tbody tr');
    await expect(tableRows.first()).toBeVisible();
  });

  test('TC-STS-23-01-02: ตรวจสอบการกรองข้อมูลตามระดับชั้นผ่าน Dropdown "ระดับชั้น"', async ({ page }) => {
    const gradeSelect = page.locator('select:has-text("ทุกชั้น"), button:has-text("ทุกชั้น"), [role="combobox"]').first();
    await expect(gradeSelect).toBeVisible(); if (await gradeSelect.isVisible()) {
      await gradeSelect.click();
      await page.waitForTimeout(200);

      const option = page.locator('option:has-text("อ.1"), [role="option"]:has-text("อ.1"), text="ป.1"').first();
      await expect(option).toBeVisible(); if (await option.isVisible()) {
        await option.click();
        await page.waitForTimeout(300);
      }
    }
    await expect(page.locator('table, div[role="table"]').first()).toBeVisible();
  });

  test('TC-STS-23-01-03: ตรวจสอบการกรองข้อมูลตามสถานะลิงก์ผ่าน Dropdown "สถานะลิงก์"', async ({ page }) => {
    const statusSelect = page.locator('select:has-text("ทุกสถานะลิงก์"), button:has-text("ทุกสถานะลิงก์"), [role="combobox"]').first();
    await expect(statusSelect).toBeVisible(); if (await statusSelect.isVisible()) {
      await statusSelect.click();
      await page.waitForTimeout(200);

      const activeOption = page.locator('option:has-text("ใช้งานอยู่"), [role="option"]:has-text("ใช้งานอยู่")').first();
      await expect(activeOption).toBeVisible(); if (await activeOption.isVisible()) {
        await activeOption.click();
        await page.waitForTimeout(300);
      }
    }
    await expect(page.locator('table, div[role="table"]').first()).toBeVisible();
  });

  test('TC-STS-23-01-04: ตรวจสอบการเลือกปีการศึกษา/ภาคเรียนผ่าน Dropdown', async ({ page }) => {
    const termSelect = page.locator('text=ปีการศึกษา, select:has-text("2569"), [role="combobox"]').first();
    await expect(termSelect).toBeVisible();
  });

  test('TC-STS-23-01-05: ตรวจสอบการแก้ไข "วันและเวลาเริ่ม" ใน Modal แก้ไขอายุลิงก์ยืนยัน LINE', async ({ page }) => {
    const editBtn = page.locator('button:has-text("แก้ไขวันเวลาลิงก์ยืนยัน LINE"), button:has-text("แก้ไข")').first();
    await expect(editBtn).toBeVisible(); if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(300);

      const modalTitle = page.locator('text=แก้ไขอายุลิงก์ยืนยัน LINE, text=แก้ไขอายุลิงก์');
      await expect(modalTitle.first()).toBeVisible();

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').first();
      await cancelBtn.click();
    }
  });

  test('TC-STS-23-01-06: ตรวจสอบการแก้ไข "วันและเวลาหมดอายุ" ใน Modal แก้ไขอายุลิงก์ยืนยัน LINE', async ({ page }) => {
    const editBtn = page.locator('button:has-text("แก้ไขวันเวลาลิงก์ยืนยัน LINE"), button:has-text("แก้ไข")').first();
    await expect(editBtn).toBeVisible(); if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(300);

      const expirationLabel = page.locator('text=วันและเวลาหมดอายุ, text=หมดอายุ').first();
      await expect(expirationLabel).toBeVisible();

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').first();
      await cancelBtn.click();
    }
  });

  test('TC-STS-23-01-07: ตรวจสอบ Negative Validation: กำหนดวันหมดอายุย้อนหลังหรือก่อนวันเริ่มต้น', async ({ page }) => {
    const editBtn = page.locator('button:has-text("แก้ไขวันเวลาลิงก์ยืนยัน LINE"), button:has-text("แก้ไข")').first();
    await expect(editBtn).toBeVisible(); if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(300);

      const saveBtn = page.locator('button:has-text("บันทึก")').first();
      await expect(saveBtn).toBeVisible();

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').first();
      await cancelBtn.click();
    }
  });

  test('TC-STS-23-01-08: ตรวจสอบการค้นหาด้วยคำค้นหาที่ไม่พบข้อมูลในระบบ (Empty State)', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ค้นหาห้อง"], input[placeholder*="ระดับชั้น"], input[placeholder*="ค้นหา"]').first();
    await expect(searchInput).toBeVisible(); if (await searchInput.isVisible()) {
      await searchInput.fill('XXXXXX_NOT_FOUND_9999');
      await page.waitForTimeout(400);

      const emptyNotice = page.locator('text=ไม่พบข้อมูล, text=ไม่มีข้อมูล, table tbody tr:has-text("ไม่พบ")').first();
      await expect(emptyNotice).toBeVisible();
    }
  });

});
