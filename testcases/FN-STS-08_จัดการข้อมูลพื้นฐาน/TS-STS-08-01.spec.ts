import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-08-01: การเพิ่มรายการและค้นหาข้อมูลพื้นฐาน', () => {

  test.beforeEach(async ({ page }) => {
    // เข้าสู่ระบบด้วยบัญชี Central Admin และไปยังหน้าจัดการข้อมูลพื้นฐาน
    await loginWithSession(page, 'council.admin', '11111111');
    await page.goto('/master-data');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-08-01-01: ตรวจสอบการกรอกข้อมูลเพิ่มรายการ "ประเภทการขาด" ด้วยรหัสที่ผิดรูปแบบ (มีเครื่องหมาย -)', async ({ page }) => {
    // 1. เข้าสู่หน้า "จัดการข้อมูลพื้นฐาน"
    // 2. เลือกประเภทของข้อมูลพื้นฐานเป็น "ประเภทการขาด"
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    // 3. คลิกปุ่ม "เพิ่มรายการ"
    await page.click('button:has-text("เพิ่มรายการ")');

    // 4. กรอกช่อง รหัส "TEST_TC-STS-08-01-01"
    const codeInput = page.locator('input[name="code"], input[placeholder*="รหัส"]').first();
    await codeInput.fill('TEST_TC-STS-08-01-01');

    // 5. กรอกช่อง ชื่อภาษาไทย "เทสประเภทการขาด"
    const nameInput = page.locator('input[name="name_th"], input[placeholder*="ชื่อภาษาไทย"], input[placeholder*="ชื่อ"]').first();
    await nameInput.fill('เทสประเภทการขาด');

    // 6. กรอกช่อง ลำดับแสดงผล "1"
    const orderInput = page.locator('input[name="display_order"], input[type="number"]').first();
    await expect(orderInput).toBeVisible(); if (await orderInput.isVisible()) {
      await orderInput.fill('1');
    }

    // 7. กดปุ่ม "บันทึก"
    await page.click('button:has-text("บันทึก")');

    // Expected Result: แสดงข้อความแจ้งเตือน "รหัสต้องเป็น A-Z, 0-9 หรือ _ และขึ้นต้นด้วยตัวอักษร"
    const errorMsg = page.locator('text=รหัสต้องเป็น A-Z, 0-9 หรือ _ และขึ้นต้นด้วยตัวอักษร, text=รหัสต้องเป็น');
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  });

  test('TC-STS-08-01-02: ตรวจสอบการกรอกข้อมูลเพิ่มรายการ "ประเภทการขาด" ด้วยรหัสที่ขึ้นต้นด้วยตัวเลข', async ({ page }) => {
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    await page.click('button:has-text("เพิ่มรายการ")');

    const codeInput = page.locator('input[name="code"], input[placeholder*="รหัส"]').first();
    await codeInput.fill('123ABSENT');

    const nameInput = page.locator('input[name="name_th"], input[placeholder*="ชื่อภาษาไทย"], input[placeholder*="ชื่อ"]').first();
    await nameInput.fill('ทดสอบรหัสขึ้นต้นตัวเลข');

    const orderInput = page.locator('input[name="display_order"], input[type="number"]').first();
    await expect(orderInput).toBeVisible(); if (await orderInput.isVisible()) {
      await orderInput.fill('1');
    }

    await page.click('button:has-text("บันทึก")');

    const errorMsg = page.locator('text=รหัสต้องเป็น A-Z, 0-9 หรือ _ และขึ้นต้นด้วยตัวอักษร, text=รหัสต้องเป็น');
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  });

  test('TC-STS-08-01-03: ตรวจสอบการกรอกข้อมูลเพิ่มรายการ "ประเภทการขาด" ด้วยรหัสที่มีช่องว่าง (Space)', async ({ page }) => {
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    await page.click('button:has-text("เพิ่มรายการ")');

    const codeInput = page.locator('input[name="code"], input[placeholder*="รหัส"]').first();
    await codeInput.fill('TEST ABSENT');

    const nameInput = page.locator('input[name="name_th"], input[placeholder*="ชื่อภาษาไทย"], input[placeholder*="ชื่อ"]').first();
    await nameInput.fill('ทดสอบรหัสมีเว้นวรรค');

    const orderInput = page.locator('input[name="display_order"], input[type="number"]').first();
    await expect(orderInput).toBeVisible(); if (await orderInput.isVisible()) {
      await orderInput.fill('1');
    }

    await page.click('button:has-text("บันทึก")');

    const errorMsg = page.locator('text=รหัสต้องเป็น A-Z, 0-9 หรือ _ และขึ้นต้นด้วยตัวอักษร, text=รหัสต้องเป็น');
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  });

  test('TC-STS-08-01-04: ตรวจสอบการกรอกรหัสที่เป็นภาษาไทย', async ({ page }) => {
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    await page.click('button:has-text("เพิ่มรายการ")');

    const codeInput = page.locator('input[name="code"], input[placeholder*="รหัส"]').first();
    await codeInput.fill('ทดสอบภาษาไทย');

    const nameInput = page.locator('input[name="name_th"], input[placeholder*="ชื่อภาษาไทย"], input[placeholder*="ชื่อ"]').first();
    await nameInput.fill('ทดสอบรหัสภาษาไทย');

    const orderInput = page.locator('input[name="display_order"], input[type="number"]').first();
    await expect(orderInput).toBeVisible(); if (await orderInput.isVisible()) {
      await orderInput.fill('1');
    }

    await page.click('button:has-text("บันทึก")');

    const errorMsg = page.locator('text=รหัสต้องเป็น A-Z, 0-9 หรือ _ และขึ้นต้นด้วยตัวอักษร, text=รหัสต้องเป็น');
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  });

  test('TC-STS-08-01-05: ตรวจสอบการกรอกข้อมูลเพิ่มรายการ "ประเภทการขาด" ด้วยข้อมูลที่ถูกต้องครบถ้วน', async ({ page }) => {
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    await page.click('button:has-text("เพิ่มรายการ")');

    const codeInput = page.locator('input[name="code"], input[placeholder*="รหัส"]').first();
    await codeInput.fill('TEST_TC_STS_08_01_01');

    const nameInput = page.locator('input[name="name_th"], input[placeholder*="ชื่อภาษาไทย"], input[placeholder*="ชื่อ"]').first();
    await nameInput.fill('เทสประเภทการขาด');

    const orderInput = page.locator('input[name="display_order"], input[type="number"]').first();
    await expect(orderInput).toBeVisible(); if (await orderInput.isVisible()) {
      await orderInput.fill('1');
    }

    await page.click('button:has-text("บันทึก")');

    // Expected Result: แสดง popup คำว่า "บันทึกแล้ว" หรือ toast แจ้งเตือนสำเร็จ
    const successPopup = page.locator('text=บันทึกแล้ว, text=บันทึกข้อมูลสำเร็จ, text=สำเร็จ');
    await expect(successPopup.first()).toBeVisible({ timeout: 5000 });
  });

  test('TC-STS-08-01-06: ตรวจสอบการกรอกข้อมูลค้นหารายการ "ประเภทการขาด" ด้วย "รหัส"', async ({ page }) => {
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    const searchInput = page.locator('input[placeholder*="ค้นหา"]').first();
    await searchInput.fill('TEST_TC_STS_08_01_01');
    await page.waitForTimeout(500);

    // Expected Result: แสดงผลการค้นหาของข้อมูลที่มีรหัส "TEST_TC_STS_08_01_01"
    const row = page.locator('tr, div').filter({ hasText: 'TEST_TC_STS_08_01_01' });
    await expect(row.first()).toBeVisible();
  });

  test('TC-STS-08-01-07: ตรวจสอบการกรอกข้อมูลค้นหารายการ "ประเภทการขาด" ด้วย "ชื่อรายการ"', async ({ page }) => {
    const selectDropdown = page.locator('select, [role="combobox"]').first();
    await expect(selectDropdown).toBeVisible(); if (await selectDropdown.isVisible()) {
      await selectDropdown.selectOption({ label: 'ประเภทการขาด' }).catch(async () => {
        await selectDropdown.click();
        await page.click('text="ประเภทการขาด"');
      });
    }

    const searchInput = page.locator('input[placeholder*="ค้นหา"]').first();
    await searchInput.fill('เทสประเภทการขาด2');
    await page.waitForTimeout(500);

    // Expected Result: แสดงผลการค้นหาของข้อมูลที่มีรหัส/ชื่อ "เทสประเภทการขาด2"
    const row = page.locator('tr, div').filter({ hasText: 'เทสประเภทการขาด2' });
    await expect(row.first()).toBeVisible();
  });

});
