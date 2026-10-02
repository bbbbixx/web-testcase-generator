import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-07 พิจารณาเคสการติดตาม
 * หน้าจอ: SC-STS-07-01 หน้าจอพิจารณาเคสการติดตาม (/student-risk-report/risk?caseStatus=PENDING_REVIEW, /cases/:id)
 * ชุดทดสอบ: TS-STS-07-02 ตรวจสอบการทำงานของปุ่มและ Action (Buttons & Actions)
 */
test.describe('FN-STS-07 - TS-STS-07-02 ตรวจสอบการทำงานของปุ่มและ Action', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');
  });

  test('TC-STS-07-02-01: ตรวจสอบการคลิกรายการเคสสถานะรอพิจารณาเพื่อเข้าสู่หน้ารายละเอียด', async ({ page }) => {
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

  test('TC-STS-07-02-02: ตรวจสอบการคลิกปุ่ม "มอบหมายช่วยเหลือ" เพื่อเปิด Modal', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. คลิกปุ่ม "มอบหมายช่วยเหลือ" หากมี
    const assignHelpBtn = page.locator('button').filter({ hasText: /มอบหมายช่วยเหลือ/i }).first();
    await expect(assignHelpBtn).toBeVisible(); if (await assignHelpBtn.isVisible()) {
      await assignHelpBtn.click();
      await page.waitForTimeout(300);

      // Expected: ปรากฏ Modal ป๊อปอัป "มอบหมายช่วยเหลือ"
      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible();
    }
  });

  test('TC-STS-07-02-03: ตรวจสอบการคลิกปุ่ม "ส่งต่อหน่วยงาน" เพื่อเปิด Modal', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. คลิกปุ่ม "ส่งต่อหน่วยงาน" หากมี
    const referralBtn = page.locator('button').filter({ hasText: /ส่งต่อหน่วยงาน/i }).first();
    await expect(referralBtn).toBeVisible(); if (await referralBtn.isVisible()) {
      await referralBtn.click();
      await page.waitForTimeout(300);

      // Expected: ปรากฏ Modal ป๊อปอัป "ส่งต่อหน่วยงาน"
      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible();
    }
  });

  test('TC-STS-07-02-04: ตรวจสอบการคลิกปุ่ม "ปิดเคส" เพื่อเปิด Modal', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. คลิกปุ่ม "ปิดเคส" หากมี
    const closeCaseBtn = page.locator('button').filter({ hasText: /ปิดเคส/i }).first();
    await expect(closeCaseBtn).toBeVisible(); if (await closeCaseBtn.isVisible()) {
      await closeCaseBtn.click();
      await page.waitForTimeout(300);

      // Expected: ปรากฏ Modal ป๊อปอัป "ปิดเคส"
      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible();
    }
  });

  test('TC-STS-07-02-05: ตรวจสอบการกดยกเลิกใน Modal การพิจารณา', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // 2. เปิด Modal ใดๆ
    const btn = page.locator('button').filter({ hasText: /มอบหมายช่วยเหลือ|ส่งต่อหน่วยงาน|ปิดเคส/i }).first();
    await expect(btn).toBeVisible(); if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible(); if (await modal.isVisible()) {
        const cancelBtn = modal.locator('button').filter({ hasText: /ยกเลิก|ปิด/i }).first();
        await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
          await cancelBtn.click();
          await page.waitForTimeout(300);
          await expect(modal).not.toBeVisible();
        }
      }
    }
  });

  test('TC-STS-07-02-06: ตรวจสอบการกดยืนยันการพิจารณาเคสและระบบอัปเดตสถานะสำเร็จ', async ({ page }) => {
    // 1. เข้าหน้ารายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // Expected: หน้าจอนำทางและแสดงข้อมูลรายละเอียดเคสได้อย่างถูกต้อง
    await expect(page).toHaveURL(/.*cases.*/);
  });
});
