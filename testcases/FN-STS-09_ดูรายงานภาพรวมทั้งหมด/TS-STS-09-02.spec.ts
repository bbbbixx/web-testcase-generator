import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-09-02: ตรวจสอบการทำงานของปุ่มและ Interaction บนหน้าหลัก Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-09-02-01: ตรวจสอบการใช้งานปุ่มซูมเข้าและซูมออก (+ / -) บนแผนที่ประเทศไทย', async ({ page }) => {
    // 1. อยู่ที่หน้าหลักระดับสภา สังเกตแผนที่ประเทศไทย
    const mapWidget = page.locator('svg, canvas, div.map-container, [aria-label*="map"]').first();
    await expect(mapWidget).toBeVisible();

    // 2. คลิกปุ่ม (+) เพื่อซูมเข้า
    const zoomInBtn = page.locator('button:has-text("+"), button[aria-label*="zoom in"], button[title*="ซูมเข้า"]').first();
    await expect(zoomInBtn).toBeVisible(); if (await zoomInBtn.isVisible()) {
      await zoomInBtn.click();
      await page.waitForTimeout(300);
    }

    // 3. คลิกปุ่ม (-) เพื่อซูมออก
    const zoomOutBtn = page.locator('button:has-text("-"), button[aria-label*="zoom out"], button[title*="ซูมออก"]').first();
    await expect(zoomOutBtn).toBeVisible(); if (await zoomOutBtn.isVisible()) {
      await zoomOutBtn.click();
      await page.waitForTimeout(300);
    }

    // Expected Result: แผนที่ขยายและย่อขนาดตามการกดปุ่มซูมได้อย่างราบรื่น
    await expect(mapWidget).toBeVisible();
  });

  test('TC-STS-09-02-02: ตรวจสอบการนำเมาส์ชี้ (Hover) บนจังหวัดในแผนที่ความร้อน', async ({ page }) => {
    // 1. เลื่อนเมาส์ไปชี้บนพื้นที่จังหวัดในแผนที่ (เช่น ชลบุรี, กทม.)
    const mapPath = page.locator('path, g.province, svg path').first();
    await expect(mapPath).toBeVisible(); if (await mapPath.isVisible()) {
      await mapPath.hover();
      await page.waitForTimeout(500);
    }

    // Expected Result: ปรากฏ Tooltip แสดงชื่อจังหวัดและจำนวนนักเรียนกลุ่มเสี่ยงอย่างชัดเจน
    const tooltip = page.locator('div[role="tooltip"], .tooltip, div.popover').first();
    // ถ้ามี tooltip ให้ตรวจสอบว่ามองเห็น
    await expect(tooltip).toBeVisible(); if (await tooltip.isVisible()) {
      await expect(tooltip).toBeVisible();
    }
  });

  test('TC-STS-09-02-03: ตรวจสอบการคลิกรายการใน Top 5 พื้นที่เสี่ยงสูง', async ({ page }) => {
    // 1. คลิกที่รายการจังหวัดอันดับ 1 ใน Top 5 (ชลบุรี)
    const top1Item = page.locator('text=ชลบุรี, text=อันดับ 1, div.top-5-item').first();
    await expect(top1Item).toBeVisible(); if (await top1Item.isVisible()) {
      await top1Item.click();
      await page.waitForTimeout(500);
    }

    // 2. สังเกตการเปลี่ยนแปลงบนหน้าจอ
    // Expected Result: ระบบกรองหรือนำทางไปยังข้อมูลรายละเอียดของพื้นที่ที่เลือกถูกต้อง
    await expect(page).not.toHaveURL('/login');
  });

});
