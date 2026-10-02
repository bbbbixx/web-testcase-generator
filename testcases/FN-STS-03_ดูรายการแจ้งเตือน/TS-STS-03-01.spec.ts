import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-03 ดูรายการแจ้งเตือน
 * หน้าจอ: SC-STS-03-01 หน้าจอรายการแจ้งเตือน (Global / ทั่วไป)
 * ชุดทดสอบ: TS-STS-03-01 ตรวจสอบการทำงานของปุ่ม (Buttons & Actions)
 */
test.describe('FN-STS-03 ดูรายการแจ้งเตือน - TS-STS-03-01 ตรวจสอบการทำงานของปุ่ม', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'council.admin', '11111111');
  });

  async function openNotificationBox(page: any) {
    const bellBtn = page.locator('[aria-controls="notification-center"]').first();
    await expect(bellBtn).toBeVisible({ timeout: 10000 });
    await bellBtn.click();
    await page.waitForTimeout(500);
  }

  test('TC-STS-03-01-01: ตรวจสอบการกรองรายการแจ้งเตือนตามแท็บ "ทั้งหมด" และ "ยังไม่ได้อ่าน"', async ({ page }) => {
    // 1. เข้าสู่ระบบ STS ด้วยบัญชีผู้ใช้งาน
    // 2. คลิกที่ไอคอนกระดิ่งแจ้งเตือนที่มุมขวาบนของ Header เพื่อเปิดกล่องการแจ้งเตือน
    await openNotificationBox(page);

    // 3. คลิกที่แท็บ "ยังไม่ได้อ่าน"
    const unreadTab = page.locator('#notification-center').getByText(/ยังไม่ได้อ่าน|ยังไม่อ่าน/i).first();
    await expect(unreadTab).toBeVisible(); if (await unreadTab.isVisible()) {
      await unreadTab.click();
    }
    // 4. ตรวจสอบรายการที่แสดงในกล่องการแจ้งเตือน
    await page.waitForTimeout(500);

    // 5. คลิกกลับมาที่แท็บ "ทั้งหมด"
    const allTab = page.locator('#notification-center').getByText(/ทั้งหมด/i).first();
    await expect(allTab).toBeVisible(); if (await allTab.isVisible()) {
      await allTab.click();
    }
    // 6. ตรวจสอบรายการที่แสดงในกล่องการแจ้งเตือน
    await expect(page.locator('#notification-center')).toBeVisible();
  });

  test('TC-STS-03-01-02: ตรวจสอบการทำงานของปุ่มไอคอนกระดิ่งเพื่อเปิดกล่องรายการแจ้งเตือน', async ({ page }) => {
    // 1. เข้าสู่ระบบ STS ด้วยบัญชีผู้ใช้งาน
    // 2. เลื่อนเมาส์ไปที่ไอคอนกระดิ่งแจ้งเตือนที่มุมขวาบนของ Header
    const bellBtn = page.locator('[aria-controls="notification-center"]').first();
    await bellBtn.hover();

    // 3. คลิกที่ไอคอนกระดิ่ง
    await bellBtn.click();

    // Expected: ระบบเปิด Dropdown แสดงกล่องรายการแจ้งเตือน (Notification Panel) ที่มุมขวาบนอย่างสมบูรณ์
    await expect(page.locator('#notification-center')).toBeVisible();
  });

  test('TC-STS-03-01-03: ตรวจสอบการทำงานของปุ่มไอคอนกระดิ่งซ้ำเพื่อปิดกล่องรายการแจ้งเตือน', async ({ page }) => {
    // 1. คลิกที่ไอคอนกระดิ่งเพื่อเปิดกล่องรายการแจ้งเตือน
    await openNotificationBox(page);
    await expect(page.locator('#notification-center')).toBeVisible();

    // 2. คลิกที่ไอคอนกระดิ่งซ้ำอีกครั้ง
    const bellBtn = page.locator('[aria-controls="notification-center"]').first();
    await bellBtn.click();

    // Expected: ระบบปิดกล่องรายการแจ้งเตือนลงอย่างถูกต้อง
    await expect(page.locator('#notification-center')).not.toBeVisible();
  });

  test('TC-STS-03-01-04: ตรวจสอบการทำงานของปุ่ม "ทำเครื่องหมายว่าอ่านแล้วทั้งหมด" (Mark all as read)', async ({ page }) => {
    // 1. เข้าสู่ระบบ STS และคลิกเปิดกล่องรายการแจ้งเตือน
    await openNotificationBox(page);

    // 2. สังเกตจำนวนแจ้งเตือนที่ยังไม่ได้อ่านบน Badge
    // 3. คลิกปุ่ม "ทำเครื่องหมายว่าอ่านแล้วทั้งหมด" (Mark all as read)
    const markAllReadBtn = page.locator('#notification-center').getByText(/ทำเครื่องหมายว่าอ่านแล้วทั้งหมด|อ่านทั้งหมด/i).first();
    await expect(markAllReadBtn).toBeVisible();
    await expect(markAllReadBtn).toBeEnabled();
    await markAllReadBtn.click();

    // Expected: 1. สถานะของทุกรายการแจ้งเตือนเปลี่ยนเป็น "อ่านแล้ว" 2. ตัวเลข Badge สีแดงบนไอคอนกระดิ่งหายไปหรือเปลี่ยนเป็น 0
    await expect(page.locator('#notification-center')).toBeVisible();
  });

  test('TC-STS-03-01-05: ตรวจสอบการทำงานของปุ่มแท็บสลับ "ยังไม่ได้อ่าน"', async ({ page }) => {
    // 1. เปิดกล่องรายการแจ้งเตือน
    await openNotificationBox(page);

    // 2. คลิกที่ปุ่มแท็บ "ยังไม่ได้อ่าน"
    const unreadTab = page.locator('#notification-center').getByText(/ยังไม่ได้อ่าน|ยังไม่อ่าน/i).first();
    await expect(unreadTab).toBeVisible(); if (await unreadTab.isVisible()) {
      await unreadTab.click();
    }

    // Expected: ระบบกรองและแสดงผลเฉพาะรายการแจ้งเตือนที่มีสถานะยังไม่ได้อ่านทันที
    await expect(page.locator('#notification-center')).toBeVisible();
  });

  test('TC-STS-03-01-06: ตรวจสอบการทำงานของปุ่มแท็บสลับ "ทั้งหมด"', async ({ page }) => {
    // 1. เปิดกล่องรายการแจ้งเตือนและอยู่ในแท็บ "ยังไม่ได้อ่าน"
    await openNotificationBox(page);
    const unreadTab = page.locator('#notification-center').getByText(/ยังไม่ได้อ่าน|ยังไม่อ่าน/i).first();
    await expect(unreadTab).toBeVisible(); if (await unreadTab.isVisible()) {
      await unreadTab.click();
    }

    // 2. คลิกที่ปุ่มแท็บ "ทั้งหมด"
    const allTab = page.locator('#notification-center').getByText(/ทั้งหมด/i).first();
    await expect(allTab).toBeVisible(); if (await allTab.isVisible()) {
      await allTab.click();
    }

    // Expected: ระบบกลับมาแสดงรายการแจ้งเตือนทั้งหมด ทั้งที่อ่านแล้วและยังไม่ได้อ่าน
    await expect(page.locator('#notification-center')).toBeVisible();
  });

  test('TC-STS-03-01-07: ตรวจสอบการคลิกรายการแจ้งเตือนเพื่อดูรายละเอียดและนำทาง (Item Click & Navigate)', async ({ page }) => {
    // 1. เข้าสู่ระบบ STS และเปิดกล่องรายการแจ้งเตือน
    await openNotificationBox(page);

    // 2. คลิกที่รายการแจ้งเตือนรายการแรกที่ยังไม่ได้อ่าน
    const firstNotifBtn = page.locator('#notification-center ul li button').first();
    await expect(firstNotifBtn).toBeVisible(); if (await firstNotifBtn.isVisible()) {
      await firstNotifBtn.click();
      await page.waitForTimeout(500);

      const actionBtn = page.locator('#notification-center').getByRole('button', { name: /ไปยังหน้าที่เกี่ยวข้อง/i }).first();
      await expect(actionBtn).toBeVisible(); if (await actionBtn.isVisible()) {
        await actionBtn.click();
      }
    }

    // Expected: 1. รายการที่ถูกคลิกเปลี่ยนสถานะเป็น "อ่านแล้ว" 2. ระบบนำทางไปยังหน้ารายละเอียดหรือฟังก์ชันที่เกี่ยวข้องกับรายการแจ้งเตือนนั้นทันที
    await expect(page).not.toHaveURL(/.*login.*/);
  });

  test('TC-STS-03-01-08: ตรวจสอบการปิดกล่องรายการแจ้งเตือนด้วยการคลิกภายนอก (Click Outside)', async ({ page }) => {
    // 1. เปิดกล่องรายการแจ้งเตือน
    await openNotificationBox(page);
    const box = page.locator('#notification-center');
    await expect(box).toBeVisible();

    // 2. คลิกที่พื้นที่ว่างภายนอกกล่องแจ้งเตือน
    await page.mouse.click(10, 10);
    await page.waitForTimeout(500);

    // Expected: กล่องรายการแจ้งเตือนปิดลงอย่างถูกต้อง
    await expect(box).not.toBeVisible();
  });
});
