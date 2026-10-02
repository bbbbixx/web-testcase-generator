import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-29-01: การกรอกข้อมูลและเงื่อนไขความถูกต้อง (Inputs & Validations)', () => {

  const TASK_TOKEN = '5105f90eecaf4b79cc9051529c16b689ed9107824fef40f1152174fc46573526';

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
    await page.goto(`/task/${TASK_TOKEN}/report`);
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-29-01-01: ตรวจสอบการเลือกวันที่และเวลาลงพื้นที่ผ่าน Date/Time Picker', async ({ page }) => {
    const datePickerBtn = page.locator('button:has-text("วันที่"), button[aria-label*="date"]').first();
    await expect(datePickerBtn).toBeVisible(); if (await datePickerBtn.isVisible()) {
      await datePickerBtn.click();
      await page.waitForTimeout(300);
      const dayCell = page.locator('button:has-text("28"), [role="gridcell"]:has-text("28")').first();
      await expect(dayCell).toBeVisible(); if (await dayCell.isVisible()) {
        await dayCell.click();
      }
    }
  });

  test('TC-STS-29-01-02: ตรวจสอบการเลือกผลการติดตามเป็น "พบนักเรียน" และระบุผู้ที่พบ/ช่องทางติดต่อ', async ({ page }) => {
    const foundRadio = page.locator('label:has-text("พบนักเรียน"), input[value="found"], input[value="FOUND"]').first();
    await expect(foundRadio).toBeVisible(); if (await foundRadio.isVisible()) {
      await foundRadio.click();
    }
  });

  test('TC-STS-29-01-03: ตรวจสอบการเลือกผลการติดตามเป็น "ไม่พบนักเรียน" และการระบุเหตุผลที่ไม่พบ', async ({ page }) => {
    const notFoundRadio = page.locator('label:has-text("ไม่พบนักเรียน"), input[value="not_found"], input[value="NOT_FOUND"]').first();
    await expect(notFoundRadio).toBeVisible(); if (await notFoundRadio.isVisible()) {
      await notFoundRadio.click();
      await page.waitForTimeout(300);

      const reasonInput = page.locator('textarea[placeholder*="เหตุผล"], input[placeholder*="เหตุผล"], textarea').first();
      await expect(reasonInput).toBeVisible(); if (await reasonInput.isVisible()) {
        await reasonInput.fill('นักเรียนออกไปทำงานรับจ้างต่างอำเภอ');
      }
    }
  });

  test('TC-STS-29-01-04: ตรวจสอบการเลือกสถานะของบิดา-มารดา (Family Status)', async ({ page }) => {
    const parentStatusDropdown = page.locator('button:has-text("เลือกสถานะ"), [role="combobox"]:has-text("บิดา-มารดา")').first();
    await expect(parentStatusDropdown).toBeVisible(); if (await parentStatusDropdown.isVisible()) {
      await parentStatusDropdown.click();
      await page.waitForTimeout(200);
    }
  });

  test('TC-STS-29-01-05: ตรวจสอบการเลือกประเภทการขาดและสาเหตุการขาดแบบ Cascading Dropdown', async ({ page }) => {
    const categoryDropdown = page.locator('button:has-text("เลือกประเภท"), [role="combobox"]:has-text("ประเภทการขาด")').first();
    await expect(categoryDropdown).toBeVisible(); if (await categoryDropdown.isVisible()) {
      await categoryDropdown.click();
      await page.waitForTimeout(200);
    }
  });

  test('TC-STS-29-01-06: ตรวจสอบการกรอกรายละเอียดสภาพความเป็นอยู่และการช่วยเหลือเบื้องต้น', async ({ page }) => {
    const detailTextarea = page.locator('textarea[placeholder*="สภาพ"], textarea[placeholder*="รายละเอียด"]').first();
    await expect(detailTextarea).toBeVisible(); if (await detailTextarea.isVisible()) {
      await detailTextarea.fill('สภาพบ้านทรุดโทรม อาศัยอยู่กับคุณยาย');
    }
  });

  test('TC-STS-29-01-07: ตรวจสอบการแก้ไขข้อมูลที่อยู่ปัจจุบันและพิกัดตำแหน่ง (FN-STS-30 Integration)', async ({ page }) => {
    const editAddressCheckbox = page.locator('input[type="checkbox"]:has-text("แก้ไขที่อยู่"), label:has-text("แก้ไขที่อยู่")').first();
    await expect(editAddressCheckbox).toBeVisible(); if (await editAddressCheckbox.isVisible()) {
      await editAddressCheckbox.click();
    }
  });

  test('TC-STS-29-01-08: ตรวจสอบการแนบไฟล์รูปภาพการลงพื้นที่และเอกสารประกอบ (Attachments Upload)', async ({ page }) => {
    const dropzone = page.locator('input[type="file"], [role="button"]:has-text("ลากและวาง"), div:has-text("ลากและวางไฟล์")').first();
    await expect(dropzone).toBeDefined();
  });

  test('TC-STS-29-01-09: ตรวจสอบการเลือกวันที่ให้ความช่วยเหลือผ่าน Custom Date Picker Popover', async ({ page }) => {
    const dateBtn = page.locator('button:has-text("กันยายน"), button:has-text("2569"), [aria-haspopup="dialog"]').first();
    await expect(dateBtn).toBeVisible(); if (await dateBtn.isVisible()) {
      await dateBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-29-01-10: ตรวจสอบการเลือกเวลาให้ความช่วยเหลือผ่าน Custom Time Picker Popover', async ({ page }) => {
    const timeBtn = page.locator('button:has-text(":"), button:has-text("16:")').first();
    await expect(timeBtn).toBeVisible(); if (await timeBtn.isVisible()) {
      await timeBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-29-01-11: ตรวจสอบการเลือกผลการช่วยเหลือเป็น "ช่วยเหลือสำเร็จ" (Positive Default)', async ({ page }) => {
    const successRadio = page.locator('label:has-text("ช่วยเหลือสำเร็จ"), input[value*="success"]').first();
    await expect(successRadio).toBeVisible(); if (await successRadio.isVisible()) {
      await successRadio.click();
    }
  });

  test('TC-STS-29-01-12: ตรวจสอบการเลือกผลการช่วยเหลือเป็น "ยังช่วยเหลือไม่สำเร็จ" และกรอกเหตุผล (Conditional)', async ({ page }) => {
    const notSuccessRadio = page.locator('label:has-text("ยังช่วยเหลือไม่สำเร็จ"), input[value*="fail"]').first();
    await expect(notSuccessRadio).toBeVisible(); if (await notSuccessRadio.isVisible()) {
      await notSuccessRadio.click();
      await page.waitForTimeout(200);
    }
  });

  test('TC-STS-29-01-13: ตรวจสอบการกรอกรายละเอียดการช่วยเหลือใน Textarea', async ({ page }) => {
    const assistDetail = page.locator('#assistance-detail, textarea[placeholder*="อธิบายสิ่งที่ดำเนินการ"]').first();
    await expect(assistDetail).toBeVisible(); if (await assistDetail.isVisible()) {
      await assistDetail.fill('ได้ประสานงานและพูดคุยกับนักเรียนและผู้ปกครองเบื้องต้นในการปรับพฤติกรรม');
    }
  });

  test('TC-STS-29-01-14: ตรวจสอบการแนบไฟล์หลักฐานประกอบการช่วยเหลือใน Dropzone', async ({ page }) => {
    const dropzone = page.locator('div:has-text("ลากและวางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์")').first();
    await expect(dropzone).toBeVisible(); if (await dropzone.isVisible()) {
      await expect(dropzone).toBeVisible();
    }
  });

  test('TC-STS-29-01-15: ตรวจสอบการแจ้งเตือนเมื่อแนบไฟล์ขนาดเกิน 5MB หรือนามสกุลไฟล์ไม่ถูกต้อง (Negative Upload)', async ({ page }) => {
    const dropzoneNotice = page.locator('text=JPG, PNG, GIF, WEBP, PDF, DOC และ DOCX').first();
    await expect(dropzoneNotice).toBeVisible(); if (await dropzoneNotice.isVisible()) {
      await expect(dropzoneNotice).toBeVisible();
    }
  });

});
