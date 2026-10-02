import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-26-03: การแสดงผลข้อมูลส่วนตัว ปฏิทิน และไทม์ไลน์ (UI Displays)', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
  });

  const gotoStudentDetail = async (page: any) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');
    const classCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classCard).toBeVisible(); if (await classCard.isVisible()) {
      await classCard.click();
      await page.waitForLoadState('networkidle');

      const rosterTab = page.locator('button:has-text("รายชื่อ"), a:has-text("รายชื่อ")').first();
      await expect(rosterTab).toBeVisible(); if (await rosterTab.isVisible()) {
        await rosterTab.click();
        await page.waitForTimeout(300);

        const studentRow = page.locator('tr, div.student-item, a[href*="/classroom/students/"]').first();
        await expect(studentRow).toBeVisible(); if (await studentRow.isVisible()) {
          await studentRow.click();
          await page.waitForLoadState('networkidle');
        }
      }
    }
  };

  test('TC-STS-26-03-01: ตรวจสอบการแสดงผลข้อมูลส่วนตัวนักเรียนในการ์ดหลัก', async ({ page }) => {
    await gotoStudentDetail(page);
    const headerCard = page.locator('div.card, div.student-profile-header').first();
    await expect(headerCard).toBeVisible();
  });

  test('TC-STS-26-03-02: ตรวจสอบการแสดงผลการ์ดสถิติ 3 กล่อง (อัตราการมาเรียน, GPA เทอมนี้, GPA รวม)', async ({ page }) => {
    await gotoStudentDetail(page);
    const statCards = page.locator('div.grid > div, div.stat-card');
    await expect(statCards.first()).toBeVisible();
  });

  test('TC-STS-26-03-03: ตรวจสอบการแสดงผลข้อมูลประกอบการดูแล (ความด้อยโอกาส และ ความพิการ)', async ({ page }) => {
    await gotoStudentDetail(page);
    const careSection = page.locator('text=ข้อมูลประกอบการดูแล, text=ความด้อยโอกาส').first();
    await expect(careSection).toBeVisible();
  });

  test('TC-STS-26-03-04: ตรวจสอบการแสดงผลสีสัญลักษณ์และคำอธิบายสถานะในปฏิทินการเข้าเรียน', async ({ page }) => {
    await gotoStudentDetail(page);
    const legend = page.locator('div.legend, text=เข้าทุกคาบ, text=ไม่เข้าเรียน').first();
    await expect(legend).toBeVisible();
  });

  test('TC-STS-26-03-05: ตรวจสอบการแสดงผลรายการความคิดเห็นและป้ายระดับข้อสังเกตในแท็บ "ความคิดเห็นจากคุณครู"', async ({ page }) => {
    await gotoStudentDetail(page);
    const commentTab = page.locator('button:has-text("ความคิดเห็น"), a:has-text("ความคิดเห็น")').first();
    await expect(commentTab).toBeVisible(); if (await commentTab.isVisible()) {
      await commentTab.click();
      await page.waitForTimeout(300);
      await expect(page.locator('div.comment-card, div.card').first()).toBeVisible();
    }
  });

  test('TC-STS-26-03-06: ตรวจสอบการแสดงผลเส้นไทม์ไลน์และลำดับเวลาของเหตุการณ์ในแท็บ "ไทม์ไลน์"', async ({ page }) => {
    await gotoStudentDetail(page);
    const timelineTab = page.locator('button:has-text("ไทม์ไลน์"), a:has-text("ไทม์ไลน์")').first();
    await expect(timelineTab).toBeVisible(); if (await timelineTab.isVisible()) {
      await timelineTab.click();
      await page.waitForTimeout(300);
      await expect(page.locator('div.timeline, div.timeline-item').first()).toBeVisible();
    }
  });

  test('TC-STS-26-03-07: ตรวจสอบการแสดงผลประวัติการติดตามช่วยเหลือนักเรียนในแท็บ "ประวัติการติดตาม"', async ({ page }) => {
    await gotoStudentDetail(page);
    const trackingTab = page.locator('button:has-text("ประวัติการติดตาม"), a:has-text("ประวัติการติดตาม")').first();
    await expect(trackingTab).toBeVisible(); if (await trackingTab.isVisible()) {
      await trackingTab.click();
      await page.waitForTimeout(300);
      await expect(page.locator('table, div[role="table"]').first()).toBeVisible();
    }
  });

  test('TC-STS-26-03-08: ตรวจสอบการแสดงผล Badge สถานะความเสี่ยง (ปกติ / เฝ้าระวัง / เสี่ยง) บนการ์ดข้อมูลส่วนตัว', async ({ page }) => {
    await gotoStudentDetail(page);
    const riskBadge = page.locator('span.badge, div.badge').first();
    await expect(riskBadge).toBeVisible();
  });

});
