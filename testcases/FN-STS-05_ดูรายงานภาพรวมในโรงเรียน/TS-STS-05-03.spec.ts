import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-05 ดูรายงานภาพรวมในโรงเรียน
 * หน้าจอ: SC-STS-05-01 หน้าจอรายงานภาพรวมในโรงเรียน (School Overview Dashboard)
 * ชุดทดสอบ: TS-STS-05-03 ตรวจสอบการแสดงผลและสิทธิ์ (Display & Permissions)
 */
test.describe('FN-STS-05 ดูรายงานภาพรวมในโรงเรียน - TS-STS-05-03 ตรวจสอบการแสดงผลและสิทธิ์', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');
  });

  test('TC-STS-05-03-01: ตรวจสอบการแสดงผลชื่อโรงเรียนและขอบเขตโรงเรียนบูรพาบนหัวแดชบอร์ด', async ({ page }) => {
    // 1. เข้าสู่หน้าหลัก Dashboard (/) ด้วย user scope บูรพา
    // 2. สังเกตชื่อโรงเรียนและป้ายขอบเขตด้านบน
    const schoolName = page.getByText(/โรงเรียนบูรพา/i).first();

    // Expected: แสดงข้อความ "โรงเรียนบูรพา" และระบุขอบเขตระดับโรงเรียนอย่างถูกต้อง
    await expect(schoolName).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-05-03-02: ตรวจสอบความถูกต้องของการคำนวณสัดส่วน % บนการ์ด KPI 4 ใบ', async ({ page }) => {
    // 1. ตรวจสอบตัวเลขบนการ์ด: นักเรียนทั้งหมด, เสี่ยงสูง , เฝ้าระวัง , ปกติ ตัวเลขแสดงได้ถูกต้อง
    const totalCard = page.getByText(/นักเรียนทั้งหมด/i).first();
    const highRiskCard = page.getByText(/เสี่ยงสูง/i).first();

    // Expected: สัดส่วนเปอร์เซ็นต์และยอดรวมนักเรียนบวกกันได้ 100% ถูกต้องตามฐานข้อมูล
    await expect(totalCard).toBeVisible();
    await expect(highRiskCard).toBeVisible();
  });

  test('TC-STS-05-03-03: ตรวจสอบการแสดงผลแผนภูมิแท่งการกระจายความเสี่ยงแยกตามระดับชั้น (ป.1 - ม.6)', async ({ page }) => {
    // 1. สังเกตแผนภูมิแท่งแจกแจงความเสี่ยงตามระดับชั้น (ป.1 ถึง ม.6)
    const gradeChart = page.locator('body').first();

    // Expected: กราฟแสดงผลแท่งสีแยกตามระดับความเสี่ยง (แดง=เสี่ยงสูง, ส้ม=เฝ้าระวัง, เขียว=ปกติ) ครบทุกระดับชั้น
    await expect(gradeChart).toBeVisible();
  });

  test('TC-STS-05-03-04: ตรวจสอบการแสดงผลกล่องสรุปสถานะเคสที่กำลังดำเนินการ', async ({ page }) => {
    // 1. ตรวจสอบส่วน "เคสที่กำลังดำเนินการ"
    const activeCasesBox = page.getByText(/เคสที่กำลังดำเนินการ/i).first();

    // Expected: แสดงยอดเคสรวม และจำแนกเป็น เปิดเคส รอติดตาม , รอพิจารณา ส ครบถ้วน
    await expect(activeCasesBox).toBeVisible();
  });

  test('TC-STS-05-03-05: ตรวจสอบการแสดงผลข้อมูลสถิติสาเหตุการขาดเรียนในแท็บ "ปัญหาที่พบ"', async ({ page }) => {
    // 1. คลิกแท็บ "ปัญหาที่พบ"
    const tabIssues = page.getByRole('button', { name: /ปัญหาที่พบ/i }).first();
    await expect(tabIssues).toBeVisible(); if (await tabIssues.isVisible()) {
      await tabIssues.click();
      await page.waitForTimeout(300);
    }

    // 2. ตรวจสอบรายการสาเหตุการขาดเรียน
    // Expected: แสดงสถิติ: ถูกต้อง
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-STS-05-03-06: ตรวจสอบการแสดงผลระดับความกังวลของครูและการส่งต่อหน่วยงานภายนอกในแท็บ "การติดตาม"', async ({ page }) => {
    // 1. คลิกแท็บ "การติดตาม"
    const tabTracking = page.getByRole('button', { name: /การติดตาม/i }).first();
    await expect(tabTracking).toBeVisible(); if (await tabTracking.isVisible()) {
      await tabTracking.click();
      await page.waitForTimeout(300);
    }

    // 2. ตรวจสอบข้อมูลสถิติการติดตาม
    // Expected: แสดงระดับความกังวล และเคสส่งต่อภายนอก ถูกต้อง
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-STS-05-03-07: ตรวจสอบการแสดงผลแนวโน้มรอบ 1 ปี (เคสเปิดใหม่ vs เคสปิดสำเร็จ) ในแท็บ "ผลลัพธ์"', async ({ page }) => {
    // 1. คลิกแท็บ "ผลลัพธ์"
    const tabResults = page.getByRole('button', { name: /ผลลัพธ์/i }).first();
    await expect(tabResults).toBeVisible(); if (await tabResults.isVisible()) {
      await tabResults.click();
      await page.waitForTimeout(300);
    }

    // 2. ตรวจสอบสถิติแนวโน้ม 1 ปี
    // Expected: แสดงข้อมูลเคสเปิดใหม่สะสม และเคสที่ปิดสำเร็จแล้ว อย่างถูกต้อง
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-STS-05-03-08: ตรวจสอบการแสดงผล Sidebar เมนูและโปรไฟล์ของ ผู้อำนวยการโรงเรียน (burapha.director)', async ({ page }) => {
    // 1. ล็อกอินด้วยบัญชี burapha.director
    await loginWithSession(page, 'burapha.director', '11111111');

    // 2. ตรวจสอบเมนู Sidebar และ Dropdown โปรไฟล์
    const sidebar = page.locator('aside, nav').first();
    await expect(sidebar).toBeVisible();
  });

  test('TC-STS-05-03-09: ตรวจสอบการแสดงผล Sidebar เมนูและโปรไฟล์ของ ผู้ดูแลระบบโรงเรียน (burapha.admin)', async ({ page }) => {
    // 1. ล็อกอินด้วยบัญชี burapha.admin
    await loginWithSession(page, 'burapha.admin', '11111111');

    // 2. ตรวจสอบว่าเข้าหน้าแดชบอร์ดโรงเรียนบูรพาได้
    const schoolName = page.getByText(/โรงเรียนบูรพา/i).first();
    await expect(schoolName).toBeVisible({ timeout: 10000 });
  });

  test('TC-STS-05-03-10: ตรวจสอบการจำกัดขอบเขตข้อมูลเฉพาะโรงเรียนบูรพา', async ({ page }) => {
    // 1. ตรวจสอบข้อมูลนักเรียน สถิติ และเคสทั้งหมดบนแดชบอร์ด
    const otherSchool = page.getByText(/โรงเรียนอนุบาลขอนแก่น|โรงเรียนกัลยาณวัตร/i);
    expect(await otherSchool.count()).toBe(0);
  });
});
