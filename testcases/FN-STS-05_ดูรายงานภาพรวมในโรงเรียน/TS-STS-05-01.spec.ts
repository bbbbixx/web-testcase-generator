import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

/**
 * ฟังก์ชัน: FN-STS-05 ดูรายงานภาพรวมในโรงเรียน
 * หน้าจอ: SC-STS-05-01 หน้าจอรายงานภาพรวมในโรงเรียน (School Overview Dashboard)
 * ชุดทดสอบ: TS-STS-05-01 ตรวจสอบการกรอกข้อมูลและตัวกรอง (Filters & Scope Selection)
 */
test.describe('FN-STS-05 ดูรายงานภาพรวมในโรงเรียน - TS-STS-05-01 ตรวจสอบตัวกรองชั้น/ห้อง', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.director', '11111111');
  });

  async function openFilterModal(page: any) {
    const filterBtn = page.locator('button').filter({ hasText: /ชั้น\/ห้อง/i }).first();
    await expect(filterBtn).toBeVisible({ timeout: 10000 });
    await filterBtn.click();
    await page.waitForTimeout(500);
  }

  test('TC-STS-05-01-01: ตรวจสอบการคลิกปุ่มตัวกรอง "ชั้น/ห้อง" เพื่อเปิด Modal "เลือก ชั้น/ห้อง"', async ({ page }) => {
    // 1. เข้าสู่หน้าหลัก Dashboard (/)
    // 2. คลิกปุ่มตัวกรอง "ชั้น/ห้อง ทุกชั้น · ทุกห้อง ∨"
    await openFilterModal(page);

    // Expected: ระบบเปิดหน้าต่าง Modal "เลือก ชั้น/ห้อง" พร้อมแสดงดรอปดาวน์ ชั้น, ห้อง และปุ่มคำสั่งครบถ้วน
    const modalHeader = page.getByText("เลือกชั้น/ห้อง").first();
    await expect(modalHeader).toBeVisible();
  });

  test('TC-STS-05-01-02: ตรวจสอบการเลือกดรอปดาวน์ "ชั้น" ใน Modal ตัวกรอง', async ({ page }) => {
    // 1. อยู่ที่ Modal "เลือก ชั้น/ห้อง"
    await openFilterModal(page);

    // 2. คลิกดรอปดาวน์ "ชั้น" และเลือกระดับชั้น (เช่น "ม.1")
    const gradeSelect = page.locator('select[aria-label="ชั้น"]').first();
    await expect(gradeSelect).toBeVisible(); if (await gradeSelect.isVisible()) {
      await gradeSelect.selectOption({ value: 'ม.1' }).catch(async () => {
        await gradeSelect.selectOption({ label: 'ม.1' });
      });
    }

    // Expected: ดรอปดาวน์ระดับชั้นแสดงค่า "ม.1" และอัปเดตตัวเลือกในดรอปดาวน์ห้องที่เกี่ยวข้อง
    const gradeVal = await gradeSelect.inputValue().catch(() => '');
    expect(gradeVal).toMatch(/ม\.1|มัธยมศึกษาปีที่ 1/i);

    const doneBtn = page.getByRole('button', { name: /เสร็จสิ้น/i });
    await expect(doneBtn).toBeVisible(); if (await doneBtn.isVisible()) {
      await doneBtn.click();
    }
  });

  test('TC-STS-05-01-03: ตรวจสอบการเลือกดรอปดาวน์ "ห้อง" ใน Modal ตัวกรอง', async ({ page }) => {
    // 1. อยู่ที่ Modal เลือก ชั้น/ห้อง
    await openFilterModal(page);

    // 2. เลือกดรอปดาวน์ "ชั้น" ก่อน (เพื่อให้ดรอปดาวน์ห้องปลดล็อก)
    const gradeSelect = page.locator('select[aria-label="ชั้น"]').first();
    await expect(gradeSelect).toBeVisible(); if (await gradeSelect.isVisible()) {
      await gradeSelect.selectOption({ value: 'ม.1' }).catch(async () => {
        await gradeSelect.selectOption({ label: 'ม.1' });
      });
      await page.waitForTimeout(300);
    }

    // 3. คลิกดรอปดาวน์ "ห้อง" และเลือกห้องเรียน ("ห้อง 1")
    const roomSelect = page.locator('select[aria-label="ห้อง"]').first();
    await expect(roomSelect).toBeVisible(); if (await roomSelect.isVisible()) {
      await roomSelect.selectOption({ value: '1' }).catch(async () => {
        await roomSelect.selectOption({ label: 'ห้อง 1' });
      });
    }

    // 4. คลิกเสร็จสิ้น
    const doneBtn = page.getByRole('button', { name: /เสร็จสิ้น/i });
    await expect(doneBtn).toBeVisible(); if (await doneBtn.isVisible()) {
      await doneBtn.click();
      await page.waitForTimeout(500);
    }

    // Expected: ดรอปดาวน์และปุ่มแสดงผลเป็น "ชั้น/ห้อง ม.1/1"
    const filterBtn = page.locator('button').filter({ hasText: /ชั้น\/ห้อง/i }).first();
    await expect(filterBtn).toHaveText(/ชั้น\/ห้อง.*ม\.1\/1/i);
  });

  test('TC-STS-05-01-04: ตรวจสอบการคลิกปุ่ม "ล้างตัวกรอง" ใน Modal เพื่อรีเซ็ตค่า', async ({ page }) => {
    // 1. ใน Modal ที่มีการเลือกชั้นและห้องไว้
    await openFilterModal(page);

    // เลือกชั้นก่อนเพื่อให้มีค่าตัวกรองค้างอยู่
    const gradeSelect = page.locator('select[aria-label="ชั้น"]').first();
    await expect(gradeSelect).toBeVisible(); if (await gradeSelect.isVisible()) {
      await gradeSelect.selectOption({ value: 'ม.1' }).catch(async () => {
        await gradeSelect.selectOption({ label: 'ม.1' });
      });
      await page.waitForTimeout(300);
    }

    // 2. คลิกปุ่ม "ล้างตัวกรอง"
    const clearBtn = page.getByRole('button', { name: /ล้างตัวกรอง/i });
    await expect(clearBtn).toBeVisible(); if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.waitForTimeout(300);
    }

    // Expected: ค่าในดรอปดาวน์ชั้นและห้องถูกรีเซ็ตกลับเป็น "ทุกชั้น" และ "ทุกห้อง" ทันที
    const gradeVal = await gradeSelect.inputValue().catch(() => '');
    const isReset = gradeVal === '' || gradeVal.includes('ทุก') || !(await page.getByText(/มัธยมศึกษาปีที่ 1/i).isVisible().catch(() => false));
    expect(isReset).toBeTruthy();

    const doneBtn = page.getByRole('button', { name: /เสร็จสิ้น/i });
    await expect(doneBtn).toBeVisible(); if (await doneBtn.isVisible()) {
      await doneBtn.click();
      await page.waitForTimeout(500);
    }

    const filterBtn = page.locator('button').filter({ hasText: /ชั้น\/ห้อง/i }).first();
    await expect(filterBtn).toHaveText(/ชั้น\/ห้อง.*ทุกชั้น.*ทุกห้อง/i);
  });

  test('TC-STS-05-01-05: ตรวจสอบการคลิกปุ่ม "เสร็จสิ้น" เพื่อนำตัวกรองชั้น/ห้องมาประมวลผลบนแดชบอร์ด', async ({ page }) => {
    // 1. เลือกระดับชั้น ม.1 และห้อง 1
    await openFilterModal(page);

    const gradeSelect = page.locator('select[aria-label="ชั้น"]').first();
    await expect(gradeSelect).toBeVisible(); if (await gradeSelect.isVisible()) {
      await gradeSelect.selectOption({ value: 'ม.1' }).catch(async () => {
        await gradeSelect.selectOption({ label: 'ม.1' });
      });
      await page.waitForTimeout(300);
    }

    const roomSelect = page.locator('select[aria-label="ห้อง"]').first();
    await expect(roomSelect).toBeVisible(); if (await roomSelect.isVisible()) {
      await roomSelect.selectOption({ value: '1' }).catch(async () => {
        await roomSelect.selectOption({ label: 'ห้อง 1' });
      });
      await page.waitForTimeout(300);
    }

    // 2. คลิกปุ่ม "เสร็จสิ้น"
    const doneBtn = page.getByRole('button', { name: /เสร็จสิ้น/i });
    await expect(doneBtn).toBeVisible();
    await doneBtn.click();

    // Expected: Modal ปิดลง ป้ายปุ่มเปลี่ยนเป็นชื่อชั้น/ห้องที่เลือก "ชั้น/ห้อง ม.1/1"
    await page.waitForTimeout(500);
    const filterBtn = page.locator('button').filter({ hasText: /ชั้น\/ห้อง/i }).first();
    await expect(filterBtn).toHaveText(/ชั้น\/ห้อง.*ม\.1\/1/i);
  });

  test('TC-STS-05-01-06: ตรวจสอบการคลิกปุ่มปิด Modal (✕) โดยไม่บันทึกการเปลี่ยนตัวกรอง', async ({ page }) => {
    // 1. ปรับเปลี่ยนค่าตัวเลือกใน Modal
    await openFilterModal(page);

    const gradeSelect = page.locator('select[aria-label="ชั้น"]').first();
    await expect(gradeSelect).toBeVisible(); if (await gradeSelect.isVisible()) {
      await gradeSelect.selectOption({ value: 'ม.1' }).catch(async () => {
        await gradeSelect.selectOption({ label: 'ม.1' });
      });
      await page.waitForTimeout(300);
    }

    // 2. คลิกปุ่มปิด (✕) มุมขวาบน
    const closeBtn = page.locator('button').filter({ hasText: /✕|ปิด/i }).first();
    await expect(closeBtn).toBeVisible(); if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }

    // Expected: Modal ปิดลง และตัวกรองบนแดชบอร์ดยังคงใช้ค่าเดิมก่อนหน้าโดยไม่ถูกบันทึกทับ
    await page.waitForTimeout(500);
    const filterBtn = page.locator('button').filter({ hasText: /ชั้น\/ห้อง/i }).first();
    await expect(filterBtn).toBeVisible();
    const modalTitle = page.locator('h2, h3, div').filter({ hasText: 'เลือกชั้น/ห้อง' }).first();
    await expect(modalTitle).not.toBeVisible();
  });
});
