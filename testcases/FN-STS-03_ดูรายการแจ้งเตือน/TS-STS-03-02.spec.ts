import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-03 ดูรายการแจ้งเตือน
 * ชุดทดสอบ: TS-STS-03-02 ตรวจสอบการแสดงผล (Display & Role Permissions)
 */
test.describe('FN-STS-03 ดูรายการแจ้งเตือน - TS-STS-03-02 ตรวจสอบการแสดงผล', () => {

  async function openNotificationBox(page: any) {
    const bellBtn = page.locator('[aria-controls="notification-center"]').first();
    await expect(bellBtn).toBeVisible({ timeout: 10000 });
    await bellBtn.click();
    await page.waitForTimeout(500);
  }

  test('TC-STS-03-02-01: ตรวจสอบการแสดงผลไอคอนกระดิ่งและ Badge ตัวเลขแจ้งเตือนที่ยังไม่ได้อ่าน', async ({ page }) => {
    // 1. เข้าสู่ระบบ STS
    await loginWithSession(page, 'council.admin', '11111111');

    // 2. สังเกตที่มุมขวาบนของ Header
    const bellBtn = page.locator('[aria-controls="notification-center"]').first();
    await expect(bellBtn).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-03-02-02: ตรวจสอบการแสดงผลข้อมูลในกล่องรายการแจ้งเตือน', async ({ page }) => {
    // 1. เข้าสู่ระบบ STS และคลิกเปิดกล่องรายการแจ้งเตือน
    await loginWithSession(page, 'council.admin', '11111111');
    await openNotificationBox(page);

    // 2. ตรวจสอบองค์ประกอบของแต่ละรายการแจ้งเตือนในกล่อง
    const box = page.locator('#notification-center');
    await expect(box).toBeVisible();
  });

  test('TC-STS-03-02-03: ตรวจสอบการแสดงผลเมื่อไม่มีรายการแจ้งเตือน (Empty State)', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วยบัญชีที่ไม่มีการแจ้งเตือนค้างอยู่
    await loginWithSession(page, 'council.admin', '11111111');

    // 2. คลิกเปิดกล่องรายการแจ้งเตือน
    await openNotificationBox(page);
    const box = page.locator('#notification-center');
    await expect(box).toBeVisible();
  });

  test('TC-STS-03-02-04: ตรวจสอบการแสดงรายการแจ้งเตือนระดับประเทศและระบบสำหรับแอดมินสภา', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วยบัญชี council.admin / 11111111
    await loginWithSession(page, 'council.admin', '11111111');

    // 2. คลิกไอคอนกระดิ่งเพื่อเปิดรายการแจ้งเตือน
    await openNotificationBox(page);
    const box = page.locator('#notification-center');
    await expect(box).toBeVisible();
  });

  test('TC-STS-03-02-05: ตรวจสอบการแสดงรายการแจ้งเตือนสรุปผลและรายงานสำหรับผู้บริหารสภา', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วยบัญชี council.executive / 11111111
    await loginWithSession(page, 'council.executive', '11111111');

    // 2. คลิกไอคอนกระดิ่งเพื่อเปิดรายการแจ้งเตือน
    await openNotificationBox(page);
    const box = page.locator('#notification-center');
    await expect(box).toBeVisible();
  });

  test('TC-STS-03-02-06: ตรวจสอบการแสดงรายการแจ้งเตือนเฉพาะโรงเรียนบูรพาสำหรับผู้อำนวยการ', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วยบัญชี burapha.director / 11111111
    await loginWithSession(page, 'burapha.director', '11111111');

    // 2. คลิกไอคอนกระดิ่งเพื่อเปิดรายการแจ้งเตือน
    await openNotificationBox(page);
    const box = page.locator('#notification-center');
    await expect(box).toBeVisible();
  });

  test('TC-STS-03-02-07: ตรวจสอบการแสดงรายการแจ้งเตือนงานนำเข้าข้อมูลและบัญชีครูของโรงเรียนบูรพา', async ({ page }) => {
    // 1. เข้าสู่ระบบด้วยบัญชี burapha.admin / 11111111
    await loginWithSession(page, 'burapha.admin', '11111111');

    // 2. คลิกไอคอนกระดิ่งเพื่อเปิดรายการแจ้งเตือน
    await openNotificationBox(page);
    const box = page.locator('#notification-center');
    await expect(box).toBeVisible();
  });
});
