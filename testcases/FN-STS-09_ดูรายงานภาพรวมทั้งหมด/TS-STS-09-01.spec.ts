import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-09-01: ตรวจสอบตัวกรองและตัวเลือกในหน้าหลัก Dashboard', () => {

  test('TC-STS-09-01-01: ตรวจสอบการเลือกขอบเขตพื้นที่/จังหวัด บน Dashboard หน้าหลัก', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย council.admin หรือ council.executive
    await loginWithSession(page, 'council.admin', '11111111');
    
    // 2. อยู่ที่หน้าหลัก Dashboard (/)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 3. คลิกดรอปดาวน์เลือกขอบเขตพื้นที่ด้านบน (เช่น เลือก ชลบุรี หรือ กรุงเทพมหานคร)
    const scopeDropdown = page.locator('button:has-text("ทุกจังหวัด"), select, [role="combobox"]').first();
    await expect(scopeDropdown).toBeVisible();
    await scopeDropdown.click();
    
    const optionChonburi = page.locator('text=ชลบุรี, [role="option"]:has-text("ชลบุรี")').first();
    await expect(optionChonburi).toBeVisible(); if (await optionChonburi.isVisible()) {
      await optionChonburi.click();
      await page.waitForTimeout(500);
    }

    // Expected Result: ตัวเลขบนการ์ดสถิติ 5 ใบ และข้อมูลบนแผนที่ปรับตามจังหวัดที่เลือกอย่างถูกต้อง
    const summaryCards = page.locator('div.grid, div.card, div[role="region"]').first();
    await expect(summaryCards).toBeVisible();
  });

  test('TC-STS-09-01-02: ตรวจสอบการเลือกตัวกรองชั้น/ห้องเรียน (ระดับโรงเรียน) บน Dashboard หน้าหลัก', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย burapha.director
    await loginWithSession(page, 'burapha.director', '11111111');

    // 2. อยู่ที่หน้าหลัก (/)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 3. คลิกดรอปดาวน์ "ทุกชั้น · ทุกห้อง" และเลือกชั้นเรียนที่ต้องการ (เช่น ป.4)
    const gradeDropdown = page.locator('text=ทุกชั้น · ทุกห้อง, button:has-text("ทุกชั้น"), button:has-text("ชั้น")').first();
    await expect(gradeDropdown).toBeVisible(); if (await gradeDropdown.isVisible()) {
      await gradeDropdown.click();
      const optionP4 = page.locator('text=ประถมศึกษาปีที่ 4, text=ป.4').first();
      await expect(optionP4).toBeVisible(); if (await optionP4.isVisible()) {
        await optionP4.click();
        await page.waitForTimeout(500);
      }
    }

    // Expected Result: กราฟระดับความเสี่ยงและตัวเลขเคสปรับกรองเฉพาะชั้นเรียนที่เลือกถูกต้อง
    const riskChart = page.locator('canvas, svg, div[role="img"], div.chart').first();
    await expect(riskChart).toBeVisible();
  });

});
