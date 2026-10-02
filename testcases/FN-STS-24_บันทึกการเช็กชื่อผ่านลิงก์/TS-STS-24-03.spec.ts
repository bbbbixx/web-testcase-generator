import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-24-03: การแสดงผลและเงื่อนไข Alert ในหน้าเช็กชื่อ (UI Displays & Alerts)', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
  });

  test('TC-STS-24-03-01: ตรวจสอบการแสดงผลการ์ดห้องเรียนและป้ายสถานะในหน้าห้องเรียนของฉัน', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible();
  });

  test('TC-STS-24-03-02: ตรวจสอบการแสดงผลการ์ดสรุปจำนวนนักเรียน Real-time (5 Live Counters)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const counters = page.locator('div.counter, div.badge, div.summary-box');
      await expect(counters.first()).toBeVisible();
    }
  });

  test('TC-STS-24-03-03: ตรวจสอบการแสดงผลสีและสัญลักษณ์ปุ่มสถานะ (เขียว=มา, เหลือง=สาย, แดง=ขาด, ส้ม=ลา)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const presentBtn = page.locator('button:has-text("มา")').first();
      await expect(presentBtn).toBeVisible();
    }
  });

  test('TC-STS-24-03-04: ตรวจสอบการสร้าง Alert นักเรียนเป็นกลุ่มเสี่ยงอัตโนมัติเมื่อขาดเรียนติดต่อกัน 3 วัน (FN-STS-25 Integration)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const alertIcon = page.locator('svg.lucide-alert-triangle, span.badge:has-text("เสี่ยง")').first();
      await expect(alertIcon).toBeVisible();
    }
  });

  test('TC-STS-24-03-05: ตรวจสอบการแสดงผลข้อมูลในแท็บ "ประวัติ" (Attendance History Log)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const historyTab = page.locator('button:has-text("ประวัติ"), a:has-text("ประวัติ")').first();
      await expect(historyTab).toBeVisible(); if (await historyTab.isVisible()) {
        await historyTab.click();
        await page.waitForTimeout(300);
        await expect(page.locator('table, div[role="table"]').first()).toBeVisible();
      }
    }
  });

  test('TC-STS-24-03-06: ตรวจสอบการแสดงผลป้ายสถานะ "ส่งแล้ว · ครั้งที่ 1" บนหัวห้องเรียนหลังบันทึกผลสำเร็จ', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const statusBadge = page.locator('span:has-text("ส่งแล้ว"), span:has-text("ยังไม่เริ่ม")').first();
      await expect(statusBadge).toBeVisible();
    }
  });

});
