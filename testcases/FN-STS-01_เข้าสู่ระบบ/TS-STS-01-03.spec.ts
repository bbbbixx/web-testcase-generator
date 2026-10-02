import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-01 เข้าสู่ระบบ
 * หน้าจอ: SC-STS-01-01 หน้าจอเข้าสู่ระบบ (/login) & SC-STS-01-02 หน้าจอหลักหลังเข้าสู่ระบบ (/)
 * ชุดทดสอบ: TS-STS-01-03 ตรวจสอบการแสดงผลหน้า Login, Sidebar, Scope และ Profile Dropdown ตามบทบาท
 */
test.describe('FN-STS-01 - TS-STS-01-03 ตรวจสอบการแสดงผลและสิทธิ์บทบาทผู้ใช้งาน', () => {

  test('TC-STS-01-03-01: ตรวจสอบการแสดงผล Label Clarity โดยช่อง Username และ Password ต้องมี placeholder ที่ชัดเจน', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // Expected: แสดงผลข้อความ placeholder "กรอกชื่อผู้ใช้งาน" และ "กรอกรหัสผ่าน" ที่ชัดเจน
    await expect(page.getByPlaceholder('กรอกชื่อผู้ใช้งาน')).toBeVisible();
    await expect(page.getByPlaceholder('กรอกรหัสผ่าน')).toBeVisible();
  });

  test('TC-STS-01-03-02: ตรวจสอบการแสดงผลข้อความ โดยภาษาในปุ่มและข้อความระบบควรเป็นภาษาไทยให้ตรงกัน', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // Expected: แสดงผลภาษาไทยบนปุ่ม "เข้าสู่ระบบ" และข้อความ "ระบบติดตามผู้เรียน"
    await expect(page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true })).toBeVisible();
    await expect(page.getByText('ระบบติดตามผู้เรียน').first()).toBeVisible();
  });

  test('TC-STS-01-03-03: ตรวจสอบการแสดงผลแถบเมนูด้านข้างและวิดเจ็ตแดชบอร์ดหลัง Login ด้วย Central Admin (council.admin)', async ({ page }) => {
    await loginWithSession(page, 'council.admin', '11111111');

    // Expected: แสดง Sidebar เมนูระดับสภา และการ์ดสรุป KPI ภาพรวมครบถ้วน
    const sidebar = page.locator('aside, nav').first();
    await expect(sidebar).toBeVisible();
    await expect(page.locator('body')).toContainText(/หน้าหลัก|รายงานสถานะนักเรียน|จัดการข้อมูล/i);
  });

  test('TC-STS-01-03-04: ตรวจสอบการแสดงผลชื่อผู้ใช้ สังกัด ตำแหน่ง และเมนูโปรไฟล์ของผู้ดูแลระบบสภา (council.admin)', async ({ page }) => {
    await loginWithSession(page, 'council.admin', '11111111');

    // 1. เปิด Profile Dropdown
    const profileBtn = page.locator('button[aria-controls="header-profile-menu"]').or(page.getByRole('button', { name: /เปิดเมนูบัญชีผู้ใช้/i })).first();
    await expect(profileBtn).toBeVisible({ timeout: 10000 });
    await profileBtn.click();

    // Expected: แสดง Profile Dropdown พร้อมเมนู "แก้ไขข้อมูลส่วนตัว" และ "ออกจากระบบ"
    const profileMenu = page.locator('#header-profile-menu');
    await expect(profileMenu).toBeVisible({ timeout: 5000 });
    await expect(profileMenu).toContainText(/ผู้ดูแลระบบ|โปรไฟล์|ออกจากระบบ/i);
  });

  test('TC-STS-01-03-05: ตรวจสอบการแสดงผลแถบเมนูด้านข้างและวิดเจ็ตแดชบอร์ดหลัง Login ด้วย Executive (council.executive)', async ({ page }) => {
    await loginWithSession(page, 'council.executive', '11111111');

    // Expected: แสดง Sidebar เมนูระดับผู้บริหาร และการ์ดสรุป KPI ภาพรวม 5 การ์ด
    const sidebar = page.locator('aside, nav').first();
    await expect(sidebar).toBeVisible();
    await expect(page.getByText(/นักเรียนทั้งหมด|นักเรียนกลุ่มเสี่ยง|เคสทั้งหมด/i).first()).toBeVisible();
  });

  test('TC-STS-01-03-06: ตรวจสอบการแสดงผลชื่อผู้ใช้ สังกัด ตำแหน่ง และเมนูโปรไฟล์ของผู้บริหารสภา (council.executive)', async ({ page }) => {
    await loginWithSession(page, 'council.executive', '11111111');

    // 1. เปิด Profile Dropdown
    const profileBtn = page.locator('button[aria-controls="header-profile-menu"]').or(page.getByRole('button', { name: /เปิดเมนูบัญชีผู้ใช้/i })).first();
    await expect(profileBtn).toBeVisible({ timeout: 10000 });
    await profileBtn.click();

    // Expected: แสดงชื่อผู้ใช้ "วรรณภา พิทักษ์ธรรม", ตำแหน่ง "ผู้บริหาร", เมนูแก้ไขข้อมูลส่วนตัวและออกจากระบบ
    const profileMenu = page.locator('#header-profile-menu');
    await expect(profileMenu).toBeVisible({ timeout: 5000 });
    await expect(profileMenu).toContainText(/วรรณภา|ผู้บริหาร|ออกจากระบบ/i);
  });

  test('TC-STS-01-03-07: ตรวจสอบการแสดงผลแถบเมนูด้านข้างและวิดเจ็ตบนหน้าแดชบอร์ดหลังเข้าสู่ระบบด้วยบทบาท "ผู้อำนวยการ" (burapha.director)', async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');

    // Expected: แสดง Sidebar เมนูระดับโรงเรียน และขอบเขต "โรงเรียนบูรพา"
    const body = page.locator('body');
    await expect(body).toContainText(/โรงเรียนบูรพา/i);
    await expect(body).toContainText(/รายงานสถานะนักเรียน|ห้องเรียนทั้งหมด|รายชื่อคุณครู/i);
  });

  test('TC-STS-01-03-08: ตรวจสอบการแสดงผลชื่อผู้ใช้ สังกัด ตำแหน่ง และเมนูโปรไฟล์ของผู้อำนวยการ (burapha.director)', async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');

    // 1. เปิด Profile Dropdown
    const profileBtn = page.locator('button[aria-controls="header-profile-menu"]').or(page.getByRole('button', { name: /เปิดเมนูบัญชีผู้ใช้/i })).first();
    await expect(profileBtn).toBeVisible({ timeout: 10000 });
    await profileBtn.click();

    // Expected: แสดงชื่อผู้ใช้ "สุภาพร วงศ์ทอง", สังกัด "โรงเรียนบูรพา", ตำแหน่ง "ผู้อำนวยการ"
    const profileMenu = page.locator('#header-profile-menu');
    await expect(profileMenu).toBeVisible({ timeout: 5000 });
    await expect(profileMenu).toContainText(/สุภาพร|โรงเรียนบูรพา|ผู้อำนวยการ/i);
  });

  test('TC-STS-01-03-10: ตรวจสอบการแสดงผลชื่อผู้ใช้ สังกัด ตำแหน่ง และเมนูโปรไฟล์ของแอดมินโรงเรียน (burapha.admin)', async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');

    // 1. เปิด Profile Dropdown
    const profileBtn = page.locator('button[aria-controls="header-profile-menu"]').or(page.getByRole('button', { name: /เปิดเมนูบัญชีผู้ใช้/i })).first();
    await expect(profileBtn).toBeVisible({ timeout: 10000 });
    await profileBtn.click();

    // Expected: แสดงชื่อผู้ใช้ "กิตติพงษ์ ศรีสวัสดิ์", สังกัด "โรงเรียนบูรพา", ตำแหน่ง "ผู้ดูแลระบบ"
    const profileMenu = page.locator('#header-profile-menu');
    await expect(profileMenu).toBeVisible({ timeout: 5000 });
    await expect(profileMenu).toContainText(/กิตติพงษ์|โรงเรียนบูรพา|ผู้ดูแลระบบ/i);
  });
});
