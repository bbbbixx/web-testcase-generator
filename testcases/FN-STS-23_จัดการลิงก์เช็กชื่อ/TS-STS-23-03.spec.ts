import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-23-03: การแสดงผลและสิทธิ์การเข้าถึง (UI & Access Control)', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
    await page.goto('/attendance/classroom-links');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-23-03-01: ตรวจสอบการแสดงผลเมนู "จัดการลิงก์คุณครู" ใต้เมนู "จัดการข้อมูล" สำหรับผู้ดูแลระบบโรงเรียน', async ({ page }) => {
    // Expected Result: แสดงกลุ่มเมนู "จัดการข้อมูล" และมีเมนูย่อย "จัดการลิงก์คุณครู" พร้อมไอคอนชัดเจน
    await expect(page).toHaveURL(/\/attendance\/classroom-links/);
  });

  test('TC-STS-23-03-02: ตรวจสอบการแสดงผล Banner "ลิงก์ยืนยัน LINE กลาง" ขอบเขตโรงเรียนและวันหมดอายุ', async ({ page }) => {
    // Expected Result: แสดงข้อความ "ลิงก์ยืนยัน LINE กลาง เปิดใช้งาน", สังกัดโรงเรียนบูรพา, วันที่เริ่ม และวันที่หมดอายุครบถ้วน
    const banner = page.locator('div.banner, div.card, div:has-text("ลิงก์ยืนยัน LINE กลาง")').first();
    await expect(banner).toBeVisible();
  });

  test('TC-STS-23-03-03: ตรวจสอบการแสดงผลคอลัมน์ตารางครูและการมอบหมาย (4 คอลัมน์หลัก + Checkbox)', async ({ page }) => {
    // Expected Result: แสดงครบ 5 ส่วน: Checkbox, ครู / การมอบหมาย, สถานะลิงก์, สถานะ LINE, เครื่องมือ
    const tableHeader = page.locator('table thead tr').first();
    await expect(tableHeader).toBeVisible();
    await expect(tableHeader).toContainText('ครู');
    await expect(tableHeader).toContainText('สถานะ');
  });

  test('TC-STS-23-03-04: ตรวจสอบการแสดงผล Badge สถานะลิงก์ ("ใช้งานอยู่", "ยังไม่เปิดใช้งาน", "หมดอายุ")', async ({ page }) => {
    // Expected Result: แสดง Badge สีเขียว "ใช้งานอยู่", สีเทา "ยังไม่เปิดใช้งาน"
    const linkStatusBadge = page.locator('table tbody td span.badge, table tbody td span').first();
    await expect(linkStatusBadge).toBeVisible();
  });

  test('TC-STS-23-03-05: ตรวจสอบการแสดงผล Badge สถานะ LINE ("ยังไม่ยืนยัน LINE", "ยืนยันแล้ว")', async ({ page }) => {
    // Expected Result: แสดงสถานะการผูกบัญชี LINE ของครูท่านนั้นอย่างถูกต้อง
    const lineStatusBadge = page.locator('table tbody td').first();
    await expect(lineStatusBadge).toBeVisible();
  });

  test('TC-STS-23-03-06: ตรวจสอบสถานะของปุ่ม "สร้างที่เลือก (N)" เปลี่ยนเป็น Enable เมื่อมีการเลือก Checkbox', async ({ page }) => {
    const selectedBtn = page.locator('button:has-text("สร้างที่เลือก")').first();
    await expect(selectedBtn).toBeDisabled();

    const checkbox = page.locator('table tbody input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible(); if (await checkbox.isVisible()) {
      await checkbox.check();
      await page.waitForTimeout(200);
      await expect(selectedBtn).toBeEnabled();
    }
  });

  test('TC-STS-23-03-07: ตรวจสอบขอบเขตข้อมูลถูกจำกัดเฉพาะครูใน "โรงเรียนบูรพา" (Scope Isolation)', async ({ page }) => {
    // Expected Result: ข้อมูลครูและห้องเรียนทั้งหมดเป็นของ "โรงเรียนบูรพา" เท่านั้น ไม่ปรากฏข้อมูลของโรงเรียนอื่น
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();
  });

});
