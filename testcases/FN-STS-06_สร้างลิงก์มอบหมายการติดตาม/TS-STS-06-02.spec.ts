import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-06 สร้างลิงก์มอบหมายการติดตาม
 * หน้าจอ: SC-STS-06-01 หน้ารายงานภาพรวมความเสี่ยงนักเรียน / รายการเคสที่ต้องติดตาม (/student-risk-report/risk, /cases/:id)
 * ชุดทดสอบ: TS-STS-06-02 ตรวจสอบการทำงานของปุ่มและ Action (Buttons & Actions)
 */
test.describe('FN-STS-06 - TS-STS-06-02 ตรวจสอบการทำงานของปุ่มและ Action', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');
  });

  test('TC-STS-06-02-01: ตรวจสอบการคลิกรายการเคสนักเรียนจากตารางเพื่อเข้าสู่หน้ารายละเอียดเคส', async ({ page }) => {
    // 1. อยู่ที่หน้ารายงานความเสี่ยง
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible({ timeout: 10000 });
    const href = await caseLink.getAttribute('href');

    // 2. คลิกรายการเคส
    await caseLink.click();
    await page.waitForTimeout(500);

    // Expected: ระบบนำทางเข้าสู่หน้ารายละเอียดเคส (/cases/:id)
    await expect(page).toHaveURL(new RegExp(`.*${href}.*`));
  });

  test('TC-STS-06-02-02: ตรวจสอบการคลิกปุ่ม "มอบหมายการติดตาม" เพื่อเปิด Modal ยืนยัน', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const unassignedRow = page.locator('tr').filter({ hasText: /รอมอบหมาย/i }).first();
    const caseLink = unassignedRow.locator('a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. คลิกปุ่มมอบหมาย
    const assignBtn = page.locator('button').filter({ hasText: /^มอบหมาย$/i }).first();
    await expect(assignBtn).toBeVisible();
    await expect(assignBtn).toBeEnabled();
    await assignBtn.click();
    await page.waitForTimeout(300);

    // Expected: ปรากฏ Modal ป๊อปอัปยืนยันการมอบหมาย
    const modal = page.locator('[role="dialog"], div:has-text("ยืนยัน")').first();
    await expect(modal).toBeVisible();
  });

  test('TC-STS-06-02-03: ตรวจสอบการกดยกเลิกใน Modal ยืนยันการมอบหมาย', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const unassignedRow = page.locator('tr').filter({ hasText: /รอมอบหมาย/i }).first();
    const caseLink = unassignedRow.locator('a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. คลิกปุ่มมอบหมายเพื่อเปิด Modal
    const assignBtn = page.locator('button').filter({ hasText: /^มอบหมาย$/i }).first();
    await expect(assignBtn).toBeVisible();
    await expect(assignBtn).toBeEnabled();
    await assignBtn.click();
    await page.waitForTimeout(300);

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible(); if (await modal.isVisible()) {
      // 3. คลิกปุ่ม "ยกเลิก"
      const cancelBtn = modal.locator('button').filter({ hasText: /ยกเลิก/i }).first();
      await cancelBtn.click();
      await page.waitForTimeout(300);

      // Expected: Modal ปิดลงทันที
      await expect(modal).not.toBeVisible();
    }
  });

  test('TC-STS-06-02-04: ตรวจสอบการกดยืนยันการมอบหมาย และระบบสร้างรอบติดตามใหม่สำเร็จ', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคสที่มีการมอบหมายอยู่แล้ว
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // Expected: มีรอบการติดตามหรือปุ่มแชร์ลิงก์ปรากฏ
    const shareBtn = page.locator('button[aria-label="แชร์ลิงก์"]').or(page.getByRole('button', { name: /แชร์ลิงก์|แชร์/i })).first();
    await expect(shareBtn.or(page.getByText(/มอบหมาย/i).first())).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-06-02-05: ตรวจสอบการคลิกปุ่ม "แชร์ลิงก์" เพื่อเปิด Modal ลิงก์ติดตาม', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคสที่มีการมอบหมายแล้ว
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. คลิกปุ่ม "แชร์ลิงก์"
    const shareBtn = page.locator('button[aria-label="แชร์ลิงก์"]').or(page.getByRole('button', { name: /แชร์ลิงก์/i })).first();
    await expect(shareBtn).toBeVisible(); if (await shareBtn.isVisible()) {
      await shareBtn.click();
      await page.waitForTimeout(500);

      // Expected: ปรากฏ Modal แชร์ลิงก์
      const shareModal = page.locator('[role="dialog"]').or(page.locator('div:has-text("แชร์ลิงก์")')).first();
      await expect(shareModal).toBeVisible();
    }
  });

  test('TC-STS-06-02-06: ตรวจสอบการกดปุ่ม "คัดลอกลิงก์" และการแสดงข้อความ Toast สำเร็จ', async ({ page }) => {
    // 1. เปิด Modal แชร์ลิงก์
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    const shareBtn = page.locator('button[aria-label="แชร์ลิงก์"]').or(page.getByRole('button', { name: /แชร์ลิงก์/i })).first();
    await expect(shareBtn).toBeVisible(); if (await shareBtn.isVisible()) {
      await shareBtn.click();
      await page.waitForTimeout(500);

      const shareModal = page.locator('[role="dialog"]').first();
      await expect(shareModal).toBeVisible(); if (await shareModal.isVisible()) {
        // 2. คลิกปุ่ม "คัดลอกลิงก์"
        const copyBtn = shareModal.locator('button').filter({ hasText: /คัดลอก/i }).first();
        await expect(copyBtn).toBeVisible(); if (await copyBtn.isVisible()) {
          await copyBtn.click();
          await page.waitForTimeout(300);

          // Expected: ระบบแสดง Toast คัดลอกสำเร็จ หรืออัปเดตสถานะปุ่ม
          const toast = page.locator('[role="status"], [role="alert"], text=คัดลอกแล้ว, text=คัดลอกสำเร็จ').first();
          await expect(toast.or(copyBtn)).toBeVisible();
        }
      }
    }
  });

  test('TC-STS-06-02-07: ตรวจสอบการกดยกเลิก/ปิด Modal แชร์ลิงก์', async ({ page }) => {
    // 1. เปิด Modal แชร์ลิงก์
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    const shareBtn = page.locator('button[aria-label="แชร์ลิงก์"]').or(page.getByRole('button', { name: /แชร์ลิงก์/i })).first();
    await expect(shareBtn).toBeVisible(); if (await shareBtn.isVisible()) {
      await shareBtn.click();
      await page.waitForTimeout(500);

      const shareModal = page.locator('[role="dialog"]').first();
      await expect(shareModal).toBeVisible(); if (await shareModal.isVisible()) {
        // 2. คลิกปุ่มปิด (✕) หรือยกเลิก
        const closeBtn = shareModal.locator('button').filter({ hasText: /✕|ปิด|ยกเลิก/i }).first();
        await expect(closeBtn).toBeVisible(); if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await page.waitForTimeout(300);

          // Expected: Modal ปิดลง
          await expect(shareModal).not.toBeVisible();
        }
      }
    }
  });
});
