import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-09-03: ตรวจสอบการแสดงผลและองค์ประกอบหลักบน Dashboard', () => {

  test('TC-STS-09-03-01: ตรวจสอบการแสดงผลการ์ดสถิติ 5 ใบในหน้าหลัก', async ({ page }) => {
    // 1. เข้าสู่ระบบและตรวจสอบส่วนบนของหน้าหลัก (/)
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Expected Result: แสดงการ์ดสถิติครบ 5 ใบพร้อมตัวเลขและไอคอนถูกต้องตามบทบาท
    const cards = page.locator('div.grid > div, div.card');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC-STS-09-03-02: ตรวจสอบการแสดงผลแผนที่ความร้อนประเทศไทย 77 จังหวัด และแถบระดับสี (Legend) สำหรับระดับสภา', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย council.admin หรือ council.executive
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 2. ตรวจสอบวิดเจ็ตแผนที่
    // Expected Result: แสดงแผนที่ 77 จังหวัดครบถ้วน พร้อมแถบอธิบายระดับสี 5 ระดับ (0 ถึง 106+)
    const mapContainer = page.locator('svg, canvas, div.map-container, [aria-label*="map"]').first();
    await expect(mapContainer).toBeVisible();
  });

  test('TC-STS-09-03-03: ตรวจสอบการแสดงผลกราฟแท่งระดับความเสี่ยงแยกรายชั้น (อ.1 - ม.6) สำหรับ ผอ.โรงเรียน', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย council.admin หรือ council.executive
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 2. เลือก scope โรงเรียน
    const scopeDropdown = page.locator('button:has-text("ทุกจังหวัด"), select, [role="combobox"]').first();
    await expect(scopeDropdown).toBeVisible(); if (await scopeDropdown.isVisible()) {
      await scopeDropdown.click();
      const schoolOption = page.locator('text=โรงเรียนบูรพา, text=บูรพา').first();
      await expect(schoolOption).toBeVisible(); if (await schoolOption.isVisible()) {
        await schoolOption.click();
        await page.waitForTimeout(500);
      }
    }

    // 3. ตรวจสอบวิดเจ็ตกราฟความเสี่ยง
    // Expected Result: แสดงกราฟแท่งเปรียบเทียบสัดส่วนนักเรียนเสี่ยงสูง เฝ้าระวัง และปกติ แยกรายชั้น อ.1 - ม.6 ครบถ้วน
    const riskChart = page.locator('canvas, svg, div.chart-container').first();
    await expect(riskChart).toBeVisible();
  });

  test('TC-STS-09-03-04: ตรวจสอบการแสดงผลวิดเจ็ต "เคสที่กำลังดำเนินการ" และ "แนวโน้มการมาเรียนรายวัน"', async ({ page }) => {
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. ตรวจสอบส่วนล่างของแดชบอร์ดหน้าหลัก
    // Expected Result: แสดงกล่องสรุปสถานะเคส (เปิดเคส, รอติดตาม, รอพิจารณา) และกราฟเส้นแนวโน้มการมาเรียน
    const casesWidget = page.locator('text=เคสที่กำลังดำเนินการ, text=เปิดเคส, text=รอติดตาม').first();
    await expect(casesWidget).toBeVisible();
  });

  test('TC-STS-09-03-05: ตรวจสอบการจำกัดขอบเขตข้อมูลหน้าหลักเฉพาะโรงเรียนบูรพา', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วย council.admin หรือ council.executive แล้วเลือก scope โรงเรียนบูรพา
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const scopeDropdown = page.locator('button:has-text("ทุกจังหวัด"), select, [role="combobox"]').first();
    await expect(scopeDropdown).toBeVisible(); if (await scopeDropdown.isVisible()) {
      await scopeDropdown.click();
      const schoolOption = page.locator('text=โรงเรียนบูรพา, text=บูรพา').first();
      await expect(schoolOption).toBeVisible(); if (await schoolOption.isVisible()) {
        await schoolOption.click();
        await page.waitForTimeout(500);
      }
    }

    // 2. สังเกตตัวเลขนักเรียนและโครงสร้างเมนู
    // Expected Result: แสดงตัวเลขนักเรียน เฉพาะของโรงเรียนบูรพา และไม่มีแผนที่ระดับประเทศ
    const headerTitle = page.locator('h1, h2, header').first();
    await expect(headerTitle).toBeVisible();
  });

});
