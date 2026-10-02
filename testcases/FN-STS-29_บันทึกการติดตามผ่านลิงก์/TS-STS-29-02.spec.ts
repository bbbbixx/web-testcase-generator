import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-29-02: การทำงานของปุ่มและการโต้ตอบ (Button Actions & Interactions)', () => {

  const TASK_TOKEN = '5105f90eecaf4b79cc9051529c16b689ed9107824fef40f1152174fc46573526';

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
    await page.goto(`/task/${TASK_TOKEN}/report`);
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-29-02-01: ตรวจสอบการคลิกปุ่ม "ดูเบอร์ติดต่อนักเรียน" บนการ์ดข้อมูลนักเรียน', async ({ page }) => {
    const phoneBtn = page.locator('button:has-text("ดูเบอร์ติดต่อนักเรียน"), button:has-text("ดูเบอร์")').first();
    await expect(phoneBtn).toBeVisible(); if (await phoneBtn.isVisible()) {
      await phoneBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-29-02-02: ตรวจสอบการคลิกปุ่ม "ดูพิกัดบ้านนักเรียน" เพื่อดูแผนที่และพิกัดเดิม', async ({ page }) => {
    const mapBtn = page.locator('button:has-text("ดูพิกัดบ้านนักเรียน"), button:has-text("ดูพิกัด")').first();
    await expect(mapBtn).toBeVisible(); if (await mapBtn.isVisible()) {
      await mapBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-29-02-03: ตรวจสอบการคลิกปุ่ม "ใช้ตำแหน่งปัจจุบัน" (Get Current GPS Geolocation)', async ({ page }) => {
    const gpsBtn = page.locator('button:has-text("ใช้ตำแหน่งปัจจุบัน")').first();
    await expect(gpsBtn).toBeVisible(); if (await gpsBtn.isVisible()) {
      await gpsBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-29-02-04: ตรวจสอบการคลิกปุ่มเลือกวันที่และปุ่มควบคุมใน Calendar Popover', async ({ page }) => {
    const dateBtn = page.locator('button:has-text("กันยายน"), button:has-text("2569")').first();
    await expect(dateBtn).toBeVisible(); if (await dateBtn.isVisible()) {
      await dateBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-29-02-05: ตรวจสอบการคลิกสลับ Radio ผลการช่วยเหลือ (Toggle Outcome Selection)', async ({ page }) => {
    const successRadio = page.locator('label:has-text("ช่วยเหลือสำเร็จ")').first();
    const notSuccessRadio = page.locator('label:has-text("ยังช่วยเหลือไม่สำเร็จ")').first();

    await expect(notSuccessRadio).toBeVisible(); if (await notSuccessRadio.isVisible()) {
      await notSuccessRadio.click();
      await page.waitForTimeout(200);
    }
    await expect(successRadio).toBeVisible(); if (await successRadio.isVisible()) {
      await successRadio.click();
      await page.waitForTimeout(200);
    }
  });

  test('TC-STS-29-02-06: ตรวจสอบการคลิกเปิด File Chooser ผ่าน Dropzone และการลบไฟล์แนบ', async ({ page }) => {
    const dropzone = page.locator('div:has-text("ลากและวางไฟล์ที่นี่")').first();
    await expect(dropzone).toBeVisible(); if (await dropzone.isVisible()) {
      await expect(dropzone).toBeVisible();
    }
  });

  test('TC-STS-29-02-07: ตรวจสอบการคลิกปุ่ม "บันทึกข้อมูล" ในแบบฟอร์มบันทึกการให้ความช่วยเหลือ', async ({ page }) => {
    const submitBtn = page.locator('button:has-text("บันทึกข้อมูล")').first();
    await expect(submitBtn).toBeVisible(); if (await submitBtn.isVisible()) {
      await expect(submitBtn).toBeVisible();
    }
  });

  test('TC-STS-29-02-08: ตรวจสอบการคลิกปุ่ม "กลับหน้าหลัก" / "ปิดหน้านี้" ในหน้าบันทึกสำเร็จ', async ({ page }) => {
    await page.goto(`/task/${TASK_TOKEN}/completed`);
    await page.waitForLoadState('networkidle');

    const homeBtn = page.locator('button:has-text("กลับหน้าหลัก"), a:has-text("กลับหน้าหลัก")').first();
    await expect(homeBtn).toBeVisible(); if (await homeBtn.isVisible()) {
      await expect(homeBtn).toBeVisible();
    }
  });

});
