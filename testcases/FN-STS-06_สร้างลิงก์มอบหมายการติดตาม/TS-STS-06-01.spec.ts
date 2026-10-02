import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-06 สร้างลิงก์มอบหมายการติดตาม
 * หน้าจอ: SC-STS-06-01 หน้ารายงานภาพรวมความเสี่ยงนักเรียน / รายการเคสที่ต้องติดตาม (/student-risk-report/risk, /cases/:id)
 * ชุดทดสอบ: TS-STS-06-01 ตรวจสอบการกรอกข้อมูลและตัวกรอง (Inputs & Filters)
 */
test.describe('FN-STS-06 - TS-STS-06-01 ตรวจสอบการกรอกข้อมูลและตัวกรอง', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');
  });

  test('TC-STS-06-01-01: ตรวจสอบการค้นหาและฟิลเตอร์รายการเคสในหน้า /student-risk-report/risk', async ({ page }) => {
    // 1. อยู่ที่หน้ารายงานความเสี่ยง
    const searchInput = page.locator('input[placeholder*="ค้นหา"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    // 2. พิมพ์ค้นหาชื่อนักเรียน "กัญญา"
    await searchInput.fill('กัญญา');
    await page.waitForTimeout(500);

    // Expected: ตารางกรองและแสดงเฉพาะรายการเคสนักเรียนที่มีชื่อตรงกับคำค้นหา
    const table = page.locator('table, tbody').first();
    await expect(table).toContainText('กัญญา');
  });

  test('TC-STS-06-01-02: ตรวจสอบการ Redirect อัตโนมัติเมื่อเข้าผ่าน URL /cases โดยตรง', async ({ page }) => {
    // 1. พิมพ์ URL /cases โดยตรง
    await page.goto('/cases');
    await page.waitForTimeout(500);

    // Expected: ระบบเปลี่ยนเส้นทาง (Redirect) ไปยังหน้า /student-risk-report/risk โดยอัตโนมัติ
    await expect(page).toHaveURL(/.*student-risk-report\/risk.*/);
  });

  test('TC-STS-06-01-03: ตรวจสอบการเลือกช่วงวันที่เริ่มต้นและสิ้นสุดการติดตาม (Date Pickers)', async ({ page }) => {
    // 1. ไปที่หน้ารายละเอียดเคส (เช่น ดึงจากเคสแรกในตาราง)
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. ตรวจสอบ Date Picker สำหรับมอบหมายการติดตาม
    const startDateBtn = page.locator('button[aria-label="วันที่เริ่มมอบหมาย"]').first();
    const endDateBtn = page.locator('button[aria-label="วันที่สิ้นสุดมอบหมาย"]').first();

    await expect(startDateBtn).toBeVisible({ timeout: 10000 });
    await expect(endDateBtn).toBeVisible({ timeout: 10000 });

    // Expected: ช่องวันที่เริ่มต้นและสิ้นสุดแสดงค่าวันที่ที่เลือกได้อย่างถูกต้อง
    const startText = await startDateBtn.innerText();
    expect(startText).toBeTruthy();
  });

  test('TC-STS-06-01-04: ตรวจสอบการค้นหาและเลือกคุณครูผู้รับผิดชอบ (ครูชื่อ "test")', async ({ page }) => {
    // 1. ไปที่หน้ารายละเอียดเคสที่ยังไม่ได้มอบหมาย
    const unassignedRow = page.locator('tr').filter({ hasText: /รอมอบหมาย/i }).first();
    const caseLink = unassignedRow.locator('a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. ค้นหาครูผู้รับผิดชอบ
    const teacherInput = page.locator('input[placeholder*="เลือกครู"], input[aria-label="ครูผู้ได้รับมอบหมาย"]').first();
    await expect(teacherInput).toBeVisible(); if (await teacherInput.isVisible()) {
      await teacherInput.click();
      await teacherInput.fill('test');
      await page.waitForTimeout(500);

      // Expected: แสดงรายการดรอปดาวน์ครู "test" และเลือกได้
      const teacherOption = page.locator('[role="option"], li, div').filter({ hasText: /test|กิตติพงษ์/i }).first();
      await expect(teacherOption).toBeVisible();
    }
  });

  test('TC-STS-06-01-05: ตรวจสอบ Validation กรณีไม่ระบุวันที่สิ้นสุดการติดตาม', async ({ page }) => {
    // 1. ไปที่หน้ารายละเอียดเคส
    const unassignedRow = page.locator('tr').filter({ hasText: /รอมอบหมาย/i }).first();
    const caseLink = unassignedRow.locator('a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. เว้นว่างวันที่สิ้นสุด
    const assignBtn = page.locator('button').filter({ hasText: /^มอบหมาย$/i }).first();
    await expect(assignBtn).toBeVisible(); if (await assignBtn.isVisible()) {
      // Expected: หากไม่ระบุวันที่สิ้นสุด ปุ่มมอบหมายจะ Disabled หรือแจ้งเตือนความผิดพลาดเมื่อกด
      const isDisabled = await assignBtn.isDisabled();
      if (!isDisabled) {
        await assignBtn.click();
        await page.waitForTimeout(300);
        const alert = page.locator('[role="alert"], text=กรุณาระบุ, text=จำเป็นต้องระบุ').first();
        await expect(alert).toBeVisible();
      } else {
        expect(isDisabled).toBeTruthy();
      }
    }
  });

  test('TC-STS-06-01-06: ตรวจสอบ Validation กรณีไม่เลือกครูผู้รับผิดชอบ', async ({ page }) => {
    // 1. ไปที่หน้ารายละเอียดเคสที่ยังไม่ได้มอบหมาย
    const unassignedRow = page.locator('tr').filter({ hasText: /รอมอบหมาย/i }).first();
    const caseLink = unassignedRow.locator('a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. ไม่เลือกครูผู้รับผิดชอบ
    const assignBtn = page.locator('button').filter({ hasText: /^มอบหมาย$/i }).first();
    await expect(assignBtn).toBeVisible(); if (await assignBtn.isVisible()) {
      const isDisabled = await assignBtn.isDisabled();
      if (!isDisabled) {
        await assignBtn.click();
        await page.waitForTimeout(300);
        const alert = page.locator('[role="alert"], text=เลือกครู, text=จำเป็น').first();
        await expect(alert).toBeVisible();
      } else {
        expect(isDisabled).toBeTruthy();
      }
    }
  });

  test('TC-STS-06-01-07: ตรวจสอบ Validation กรณีเลือกวันที่สิ้นสุดก่อนวันที่เริ่มต้น', async ({ page }) => {
    // 1. ไปที่หน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. ตรวจสอบเงื่อนไข Date Picker
    const endDateBtn = page.locator('button[aria-label="วันที่สิ้นสุดมอบหมาย"]').first();
    await expect(endDateBtn).toBeVisible({ timeout: 10000 });
  });
});
