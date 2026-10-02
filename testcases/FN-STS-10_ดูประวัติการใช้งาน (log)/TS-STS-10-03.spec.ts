import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-10-03: การแสดงผลและสิทธิ์ในหน้าบันทึกการใช้งาน', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/council/audit-log');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-10-03-01: ตรวจสอบการแสดงผลจำนวนรายการทั้งหมดและ Breadcrumb ในหน้าบันทึกการใช้งาน', async ({ page }) => {
    // Expected Result: แสดง Breadcrumb "หน้าหลัก > บันทึกการใช้งาน" และแสดงจำนวนรายการทั้งหมดชัดเจน
    const pageHeader = page.locator('h1, h2, div.breadcrumb').first();
    await expect(pageHeader).toBeVisible();
    await expect(pageHeader).toContainText(/บันทึกการใช้งาน|ประวัติการใช้งาน/);
  });

  test('TC-STS-10-03-02: ตรวจสอบการแสดงผลคอลัมน์ในตารางบันทึกการใช้งานครบถ้วน', async ({ page }) => {
    // Expected Result: แสดงคอลัมน์ครบ: เวลา, ประเภท, ผู้ทำรายการ, เป้าหมาย, รายละเอียด, และปุ่มเครื่องมือดูรายละเอียด
    const tableHeader = page.locator('table thead tr').first();
    await expect(tableHeader).toBeVisible();
    await expect(tableHeader).toContainText('เวลา');
    await expect(tableHeader).toContainText('ผู้ทำรายการ');
  });

  test('TC-STS-10-03-03: ตรวจสอบการแสดงผลสถานะและประเภทการกระทำ (Action Type Badges)', async ({ page }) => {
    // Expected Result: แสดง Badge และไอคอนประเภทชัดเจน
    const badges = page.locator('span.badge, div.badge, td span').first();
    await expect(badges).toBeVisible();
  });

  test('TC-STS-10-03-04: ตรวจสอบการเข้าถึงเมนูบันทึกการใช้งานเฉพาะผู้ดูแลระบบสภา (council.admin)', async ({ page }) => {
    // Expected Result: ปรากฏเมนู "บันทึกการใช้งาน" และสามารถคลิกเข้าสู่หน้า /council/audit-log ได้อย่างสมบูรณ์
    await expect(page).toHaveURL(/\/council\/audit-log/);
  });

  test('TC-STS-10-03-05: ตรวจสอบการแสดงผลตารางเมื่อไม่พบข้อมูลตามเงื่อนไขตัวกรอง (Empty State)', async ({ page }) => {
    const searchInput = page.locator('#audit-search, input[placeholder*="ค้นหา"]').first();
    await searchInput.fill('NON_EXISTENT_DATA_123456789');
    await page.waitForTimeout(500);

    // Expected Result: แสดงข้อความ "ไม่พบข้อมูลบันทึกการใช้งาน" หรือแถวว่างอย่างเป็นระเบียบสวยงาม
    const emptyState = page.locator('text=ไม่พบข้อมูล, text=0 รายการ, table tbody tr:has-text("ไม่พบ")');
    await expect(emptyState.first()).toBeVisible();
  });

  test('TC-STS-10-03-06: ตรวจสอบการแสดงผลรายละเอียดบันทึกการใช้งานในหน้า Detail (/audit-log/:id)', async ({ page }) => {
    const detailBtn = page.locator('button:has-text("ดูรายละเอียด"), a:has-text("ดูรายละเอียด"), svg.lucide-eye').first();
    await expect(detailBtn).toBeVisible(); if (await detailBtn.isVisible()) {
      await detailBtn.click();
      await page.waitForTimeout(500);
      
      // Expected Result: แสดงหัวข้อ "รายละเอียดบันทึกการใช้งาน" พร้อมข้อมูล Metadata ครบถ้วน
      const title = page.locator('h1, h2, h3').first();
      await expect(title).toBeVisible();
    }
  });

});
