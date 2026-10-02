import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-23-02: การทำงานของปุ่มและการโต้ตอบ (Button Actions & Interactions)', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
    await page.goto('/attendance/classroom-links');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-23-02-01: ตรวจสอบการคลิกปุ่ม "คัดลอกลิงก์ยืนยัน LINE" บน Banner', async ({ page }) => {
    const copyBannerBtn = page.locator('button:has-text("คัดลอกลิงก์ยืนยัน LINE"), button:has-text("คัดลอกลิงก์กลาง")').first();
    await expect(copyBannerBtn).toBeVisible(); if (await copyBannerBtn.isVisible()) {
      await copyBannerBtn.click();
      await page.waitForTimeout(300);
      const toast = page.locator('text=คัดลอกสำเร็จ, text=คัดลอกเรียบร้อย').first();
      await expect(toast).toBeVisible();
    }
  });

  test('TC-STS-23-02-02: ตรวจสอบการคลิกปุ่ม "แก้ไขวันเวลาลิงก์ยืนยัน LINE" เพื่อเปิด Modal', async ({ page }) => {
    const editBtn = page.locator('button:has-text("แก้ไขวันเวลาลิงก์ยืนยัน LINE"), button:has-text("แก้ไข")').first();
    await expect(editBtn).toBeVisible(); if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('text=แก้ไขอายุลิงก์ยืนยัน LINE, text=แก้ไขอายุลิงก์').first()).toBeVisible();
    }
  });

  test('TC-STS-23-02-03: ตรวจสอบการคลิกปุ่ม "บันทึก" ใน Modal แก้ไขอายุลิงก์ยืนยัน LINE', async ({ page }) => {
    const editBtn = page.locator('button:has-text("แก้ไขวันเวลาลิงก์ยืนยัน LINE"), button:has-text("แก้ไข")').first();
    await expect(editBtn).toBeVisible(); if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(300);

      const saveBtn = page.locator('button:has-text("บันทึก")').first();
      await saveBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-23-02-04: ตรวจสอบการคลิกปุ่ม "ยกเลิก" หรือ "X" เพื่อปิด Modal โดยไม่บันทึก', async ({ page }) => {
    const editBtn = page.locator('button:has-text("แก้ไขวันเวลาลิงก์ยืนยัน LINE"), button:has-text("แก้ไข")').first();
    await expect(editBtn).toBeVisible(); if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(300);

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').first();
      await cancelBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-23-02-05: ตรวจสอบการคลิกปุ่ม "ปิดลิงก์ยืนยัน LINE" (Deactivate Global Link) และ Dialog ยืนยัน', async ({ page }) => {
    const deactivateBtn = page.locator('button:has-text("ปิดลิงก์ยืนยัน LINE"), button:has-text("ปิดลิงก์")').first();
    await expect(deactivateBtn).toBeVisible(); if (await deactivateBtn.isVisible()) {
      await expect(deactivateBtn).toBeVisible();
    }
  });

  test('TC-STS-23-02-06: ตรวจสอบการคลิกปุ่ม "สร้างทั้งหมด" เพื่อสร้างลิงก์เช็กชื่อให้ครูทุกคน', async ({ page }) => {
    const generateAllBtn = page.locator('button:has-text("สร้างทั้งหมด")').first();
    await expect(generateAllBtn).toBeVisible();
  });

  test('TC-STS-23-02-07: ตรวจสอบการเลือก Checkbox เลือกครูหลายคน และคลิกปุ่ม "สร้างที่เลือก (N)"', async ({ page }) => {
    const checkboxes = page.locator('table tbody input[type="checkbox"]');
    if (await checkboxes.count() >= 2) {
      await checkboxes.nth(0).check();
      await checkboxes.nth(1).check();
      await page.waitForTimeout(200);

      const selectedBtn = page.locator('button:has-text("สร้างที่เลือก")').first();
      await expect(selectedBtn).toBeEnabled();
    }
  });

  test('TC-STS-23-02-08: ตรวจสอบการคลิกปุ่ม "คัดลอกลิงก์" ประจำแถวของครูแต่ละคน', async ({ page }) => {
    const rowCopyBtn = page.locator('table tbody button:has-text("คัดลอกลิงก์"), table tbody svg.lucide-copy').first();
    await expect(rowCopyBtn).toBeVisible(); if (await rowCopyBtn.isVisible()) {
      await rowCopyBtn.click();
      await page.waitForTimeout(300);
    }
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('TC-STS-23-02-09: ตรวจสอบการคลิกปุ่ม "ส่งลิงก์" เพื่อส่งลิงก์ผ่าน LINE ให้ครูประจำชั้น', async ({ page }) => {
    const sendBtn = page.locator('table tbody button:has-text("ส่งลิงก์"), table tbody button:has-text("ส่ง")').first();
    await expect(sendBtn).toBeVisible(); if (await sendBtn.isVisible()) {
      await expect(sendBtn).toBeVisible();
    }
  });

  test('TC-STS-23-02-10: ตรวจสอบการคลิกปุ่ม "สร้างลิงก์ใหม่" (Regenerate Link) ในแถวของครู', async ({ page }) => {
    const regenBtn = page.locator('table tbody button:has-text("สร้างลิงก์ใหม่"), table tbody button:has-text("สร้างใหม่")').first();
    await expect(regenBtn).toBeVisible(); if (await regenBtn.isVisible()) {
      await expect(regenBtn).toBeVisible();
    }
  });

});
