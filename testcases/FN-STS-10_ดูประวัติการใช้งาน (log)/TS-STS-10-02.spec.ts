import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-10-02: Interaction และ Pagination ในหน้าบันทึกการใช้งาน', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/council/audit-log');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-10-02-01: ตรวจสอบการคลิกปุ่ม "ล้างตัวกรอง" เพื่อรีเซ็ตค่าค้นหาทั้งหมด', async ({ page }) => {
    const searchInput = page.locator('#audit-search, input[placeholder*="ค้นหา"]').first();
    await searchInput.fill('burapha.director');

    const resetBtn = page.locator('button:has-text("ล้างตัวกรอง"), button:has-text("ล้างค่า")').first();
    await expect(resetBtn).toBeVisible(); if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await expect(searchInput).toHaveValue('');
    }
  });

  test('TC-STS-10-02-02: ตรวจสอบการคลิกหัวคอลัมน์เพื่อเรียงลำดับข้อมูล (Sort Ascending / Descending)', async ({ page }) => {
    const timeHeader = page.locator('th:has-text("เวลา"), th:has-text("Timestamp")').first();
    await expect(timeHeader).toBeVisible(); if (await timeHeader.isVisible()) {
      await timeHeader.click();
      await page.waitForTimeout(300);
      await timeHeader.click();
      await page.waitForTimeout(300);
    }
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('TC-STS-10-02-03: ตรวจสอบการคลิกปุ่มเปลี่ยนหน้าใน Pagination (Next, Prev, หมายเลขหน้า)', async ({ page }) => {
    const nextBtn = page.locator('button:has-text("ถัดไป"), button:has-text(">")').first();
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await page.waitForTimeout(400);
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('TC-STS-10-02-04: ตรวจสอบการเปลี่ยนจำนวนแถวที่แสดงต่อหน้า (Rows Per Page)', async ({ page }) => {
    const rowsPerPageSelect = page.locator('select:has-text("หน้า"), select.rows-per-page').first();
    await expect(rowsPerPageSelect).toBeVisible(); if (await rowsPerPageSelect.isVisible()) {
      await rowsPerPageSelect.selectOption({ label: '50 / หน้า' }).catch(async () => {
        await rowsPerPageSelect.selectOption('50');
      });
      await page.waitForTimeout(500);
    }
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('TC-STS-10-02-05: ตรวจสอบการคลิกปุ่ม "ดูรายละเอียด" ในตารางเพื่อเปิดหน้ารายละเอียดเคส Log', async ({ page }) => {
    const detailBtn = page.locator('button:has-text("ดูรายละเอียด"), a:has-text("ดูรายละเอียด"), svg.lucide-eye').first();
    await expect(detailBtn).toBeVisible(); if (await detailBtn.isVisible()) {
      await detailBtn.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/audit-log\//);
    }
  });

  test('TC-STS-10-02-06: ตรวจสอบการคลิกปุ่ม "ย้อนกลับ" ในหน้ารายละเอียดเพื่อกลับมายังหน้ารายการ', async ({ page }) => {
    const detailBtn = page.locator('button:has-text("ดูรายละเอียด"), a:has-text("ดูรายละเอียด"), svg.lucide-eye').first();
    await expect(detailBtn).toBeVisible(); if (await detailBtn.isVisible()) {
      await detailBtn.click();
      await page.waitForTimeout(500);
      
      const backBtn = page.locator('button:has-text("ย้อนกลับ"), a:has-text("ย้อนกลับ")').first();
      await expect(backBtn).toBeVisible(); if (await backBtn.isVisible()) {
        await backBtn.click();
        await expect(page).toHaveURL(/\/council\/audit-log/);
      }
    }
  });

});
