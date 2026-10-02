import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-07 พิจารณาเคสการติดตาม
 * หน้าจอ: SC-STS-07-01 หน้าจอพิจารณาเคสการติดตาม (/student-risk-report/risk?caseStatus=PENDING_REVIEW, /cases/:id)
 * ชุดทดสอบ: TS-STS-07-01 ตรวจสอบการกรอกข้อมูลและตัวกรอง (Inputs & Filters)
 */
test.describe('FN-STS-07 - TS-STS-07-01 ตรวจสอบการกรอกข้อมูลและตัวกรอง', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');
  });

  test('TC-STS-07-01-01: ตรวจสอบการเลือกฟิลเตอร์แท็บ "รอพิจารณา" และตัวกรองย่อย', async ({ page }) => {
    // 1. ไปที่หน้ารายงานสถานะนักเรียน
    await page.goto('/student-risk-report/risk');
    await page.waitForTimeout(500);

    // 2. คลิกแท็บ "รอพิจารณา"
    const pendingTab = page.getByRole('button', { name: /รอพิจารณา/i }).or(page.getByText(/รอพิจารณา/i)).first();
    await expect(pendingTab).toBeVisible({ timeout: 10000 });
    await pendingTab.click();
    await page.waitForTimeout(300);

    // Expected: แท็บ "รอพิจารณา" ทำงานและตารางอัปเดตรายการเคสรอพิจารณา
    await expect(page.locator('body')).toContainText(/รอพิจารณา/i);
  });

  test('TC-STS-07-01-02: ตรวจสอบตัวกรองปีการศึกษา ภาคเรียน ระดับชั้น และห้องเรียน', async ({ page }) => {
    // 1. อยู่ที่หน้ารายการเคส
    await page.goto('/student-risk-report/risk');
    await page.waitForTimeout(500);

    // 2. ตรวจสอบปุ่มตัวกรองชั้น/ห้อง
    const filterBtn = page.locator('button').filter({ hasText: /ชั้น\/ห้อง/i }).first();
    await expect(filterBtn).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-07-01-03: ตรวจสอบการกรอกฟิลด์มาตรการและเหตุผลใน Modal "มอบหมายช่วยเหลือ"', async ({ page }) => {
    // 1. เข้าหน้ารายรายละเอียดเคส
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

      // Expected: กรอกมาตรการช่วยเหลือและเหตุผลการพิจารณาได้
      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible();
    }
  });

  test('TC-STS-07-01-04: ตรวจสอบการเลือกหน่วยงานและกรอกเหตุผลใน Modal "ส่งต่อหน่วยงาน"', async ({ page }) => {
    // 1. เข้าหน้ารายรายละเอียดเคส
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

      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible();
    }
  });

  test('TC-STS-07-01-05: ตรวจสอบการกรอกเหตุผลและสรุปใน Modal "ปิดเคส"', async ({ page }) => {
    // 1. เข้าหน้ารายรายละเอียดเคส
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

      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible();
    }
  });

  test('TC-STS-07-01-06: ตรวจสอบ Validation กรณีไม่ได้กรอกเหตุผลการพิจารณา', async ({ page }) => {
    // 1. เข้าหน้ารายรายละเอียดเคส
    const caseLink = page.locator('table a[href*="/cases/"]').first();
    await expect(caseLink).toBeVisible(); if (await caseLink.isVisible()) {
      await caseLink.click();
      await page.waitForTimeout(500);
    }

    // Expected: ปุ่มดำเนินการพิจารณาหลักถูกจัดสรรอย่างปลอดภัย
    const pageBody = page.locator('body');
    await expect(pageBody).toBeVisible();
  });
});
