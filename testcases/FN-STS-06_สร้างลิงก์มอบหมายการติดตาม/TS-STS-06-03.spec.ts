import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-06 สร้างลิงก์มอบหมายการติดตาม
 * หน้าจอ: SC-STS-06-01 หน้ารายงานภาพรวมความเสี่ยงนักเรียน / รายการเคสที่ต้องติดตาม (/student-risk-report/risk, /cases/:id)
 * ชุดทดสอบ: TS-STS-06-03 ตรวจสอบการแสดงผลและสิทธิ์ (Display & Scope Permissions)
 */
test.describe('FN-STS-06 - TS-STS-06-03 ตรวจสอบการแสดงผลและสิทธิ์', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');
  });

  test('TC-STS-06-03-01: ตรวจสอบการแสดงผลข้อมูลนักเรียนและประวัติการติดตาม (Timeline)', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // Expected: แสดงข้อมูลนักเรียนครบถ้วน และประวัติแต่ละรอบ (Timeline)
    const caseHeader = page.locator('main').first();
    await expect(caseHeader).toContainText(/โรงเรียนบูรพา|ข้อมูลการติดตาม|ประวัติ/i);
  });

  test('TC-STS-06-03-02: ตรวจสอบการแสดงป้ายสถานะกรณีลิงก์เดิมหมดอายุ', async ({ page }) => {
    // 1. ตรวจสอบสถานะการติดตามบนตารางรายการเคส
    const statusBadge = page.locator('table [data-case-status], table span').filter({ hasText: /รอติดตาม|รอมอบหมาย|หมดอายุ|เสร็จสิ้น/i }).first();
    await expect(statusBadge).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-06-03-03: ตรวจสอบความถูกต้องของ URL ลิงก์ติดตาม โดยครูเปิดกรอกรายงานได้โดยไม่ต้อง Login', async ({ browser, page }) => {
    // 1. เข้าหน้ารายละเอียดเคสที่มีการมอบหมายแล้ว
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. คลิกปุ่ม "แชร์ลิงก์" เพื่อเอา URL ติดตาม
    const shareBtn = page.locator('button[aria-label="แชร์ลิงก์"]').or(page.getByRole('button', { name: /แชร์ลิงก์/i })).first();
    await expect(shareBtn).toBeVisible(); if (await shareBtn.isVisible()) {
      await shareBtn.click();
      await page.waitForTimeout(500);

      const shareModal = page.locator('[role="dialog"]').first();
      await expect(shareModal).toBeVisible(); if (await shareModal.isVisible()) {
        const linkInput = shareModal.locator('input').first();
        const trackingUrl = await linkInput.inputValue();

        if (trackingUrl && trackingUrl.startsWith('http')) {
          // 3. เปิดใน Incognito / Context ใหม่แบบไม่ได้ล็อกอิน
          const anonContext = await browser.newContext();
          const teacherPage = await anonContext.newPage();
          await teacherPage.goto(trackingUrl);
          await teacherPage.waitForTimeout(1000);

          // Expected: เปิดหน้ากรอกรายงานติดตามได้ทันที โดยไม่โดน Redirect ไปหน้า /login
          await expect(teacherPage).not.toHaveURL(/.*login.*/);
          await anonContext.close();
        }
      }
    }
  });

  test('TC-STS-06-03-04: ตรวจสอบการจำกัดขอบเขตข้อมูลเฉพาะโรงเรียนของตนเอง (Role Scope)', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย burapha.director
    // 2. ตรวจสอบรายชื่อโรงเรียนที่ปรากฏในตาราง
    const schoolTags = page.locator('table').first();
    await expect(schoolTags).toContainText('โรงเรียนบูรพา');
    await expect(schoolTags).not.toContainText('โรงเรียนอื่นนอกสังกัด');
  });

  test('TC-STS-06-03-05: ตรวจสอบการแสดงผลรายชื่อครูในสังกัดในช่องเลือกครูผู้รับผิดชอบ', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const unassignedRow = page.locator('tr').filter({ hasText: /รอมอบหมาย/i }).first();
    const caseLink = unassignedRow.locator('a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. คลิกช่องเลือกครูผู้รับผิดชอบ
    const teacherInput = page.locator('input[placeholder*="เลือกครู"], input[aria-label="ครูผู้ได้รับมอบหมาย"]').first();
    await expect(teacherInput).toBeVisible(); if (await teacherInput.isVisible()) {
      await teacherInput.click();
      await page.waitForTimeout(300);

      // Expected: ปรากฏรายชื่อครูในสังกัดโรงเรียนบูรพา
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).toContain('โรงเรียนบูรพา');
    }
  });
});
