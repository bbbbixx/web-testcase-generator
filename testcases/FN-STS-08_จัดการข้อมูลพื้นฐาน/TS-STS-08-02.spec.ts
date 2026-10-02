import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-08-02: การปิดใช้งานและแก้ไขรายการข้อมูลพื้นฐาน', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/master-data');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-08-02-01: ตรวจสอบปุ่ม "ปิดการใช้งาน" ของรายการข้อมูลพื้นฐาน "ประเภทการขาด"', async ({ page }) => {
    // 1. เข้าสู่หน้า "จัดการข้อมูลพื้นฐาน"
    // 2. เลือกประเภทของข้อมูลพื้นฐานเป็น "ประเภทการขาด"
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    // 3. กดปุ่ม "ปิด" ในแถวที่มีรหัส คือ "TEST_TC_STS_08_01_01"
    const targetRow = page.locator('tr, div.table-row').filter({ hasText: 'TEST_TC_STS_08_01_01' }).first();
    const disableBtn = targetRow.locator('button:has-text("ปิด"), button:has-text("ปิดใช้งาน"), input[type="checkbox"]').first();
    await disableBtn.click();

    // 4. กด "ปิดใช้งาน" ใน modal ยืนยัน (ถ้ามี)
    const confirmBtn = page.locator('button:has-text("ปิดใช้งาน"), button:has-text("ยืนยัน")');
    await expect(confirmBtn).toBeVisible(); if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }

    // Expected Result 1: แสดง popup "บันทึกแล้ว"
    const popupMsg = page.locator('text=บันทึกแล้ว, text=บันทึกข้อมูลสำเร็จ, text=สำเร็จ');
    await expect(popupMsg.first()).toBeVisible({ timeout: 5000 });

    // Expected Result 2: แถวของรหัส "TEST_TC_STS_08_01_01" จะแสดงสถานะว่า "ปิดใช้งาน"
    const updatedRow = page.locator('tr, div.table-row').filter({ hasText: 'TEST_TC_STS_08_01_01' }).first();
    await expect(updatedRow).toContainText('ปิดใช้งาน');
  });

  test('TC-STS-08-02-02: ตรวจสอบปุ่ม "แก้ไข" ของรายการข้อมูลพื้นฐาน "ประเภทการขาด"', async ({ page }) => {
    // 1. เข้าสู่หน้า "จัดการข้อมูลพื้นฐาน"
    // 2. เลือกประเภทของข้อมูลพื้นฐานเป็น "ประเภทการขาด"
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    // 3. กดปุ่ม "แก้ไข" ในแถวที่มีรหัส คือ "TEST_TC_STS_08_01_01"
    const targetRow = page.locator('tr, div.table-row').filter({ hasText: 'TEST_TC_STS_08_01_01' }).first();
    const editBtn = targetRow.locator('button:has-text("แก้ไข"), svg.lucide-edit, button.btn-edit').first();
    await editBtn.click();

    // 4. กรอกในช่องชื่อภาษาไทยว่า "เทสประเภทการขาด1"
    const nameInput = page.locator('input[name="name_th"], input[placeholder*="ชื่อภาษาไทย"], input[placeholder*="ชื่อ"]').first();
    await nameInput.fill('เทสประเภทการขาด1');

    // 5. กดติ๊กปุ่ม "เปิดใช้งาน"
    const activeCheckbox = page.locator('label:has-text("เปิดใช้งาน") input, input[name="is_active"]').first();
    await expect(activeCheckbox).toBeVisible();
    if (!(await activeCheckbox.isChecked())) {
      await activeCheckbox.check();
    }
    await expect(activeCheckbox).toBeChecked();

    // 6. กดปุ่ม "บันทึก"
    await page.click('button:has-text("บันทึก")');

    // Expected Result 1: แสดง popup "บันทึกแล้ว"
    const popupMsg = page.locator('text=บันทึกแล้ว, text=บันทึกข้อมูลสำเร็จ, text=สำเร็จ');
    await expect(popupMsg.first()).toBeVisible({ timeout: 5000 });

    // Expected Result 2 & 3: แถวที่มีรหัส "TEST_TC_STS_08_01_01" จะแสดงสถานะ "เปิดใช้งาน" และชื่อ "เทสประเภทการขาด1"
    const updatedRow = page.locator('tr, div.table-row').filter({ hasText: 'TEST_TC_STS_08_01_01' }).first();
    await expect(updatedRow).toContainText('เปิดใช้งาน');
    await expect(updatedRow).toContainText('เทสประเภทการขาด1');
  });

});
