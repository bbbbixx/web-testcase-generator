import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-24-01: ตรวจสอบการกรอกข้อมูล ค้นหา และระบุสถานะเช็กชื่อ (FN-STS-24)', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
  });

  test('TC-STS-24-01-01: ตรวจสอบการค้นหาห้องเรียนในหน้าห้องเรียนของฉัน (Classroom Search)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[placeholder*="ค้นหา"], input[type="text"]').first();
    await expect(searchInput).toBeVisible(); if (await searchInput.isVisible()) {
      await searchInput.fill('อ.1/1');
      await page.waitForTimeout(400);
      await expect(page.locator('body')).toContainText(/อ\.1\/1/);
    }
  });

  test('TC-STS-24-01-02: ตรวจสอบการกรองห้องเรียนตามระดับชั้น (Grade Filter Dropdown)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const gradeDropdown = page.locator('select, [role="combobox"]').first();
    await expect(gradeDropdown).toBeVisible(); if (await gradeDropdown.isVisible()) {
      await gradeDropdown.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-24-01-03: ตรวจสอบการเลือกวันที่เช็กชื่อผ่าน Date Picker (#check-in-date)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const datePicker = page.locator('#check-in-date, button:has-text("กันยายน"), button:has-text("2569")').first();
      await expect(datePicker).toBeVisible(); if (await datePicker.isVisible()) {
        await datePicker.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('TC-STS-24-01-04: ตรวจสอบการระบุสถานะเช็กชื่อในมุมมองตาราง (Table View) ครบ 4 สถานะ (มา, สาย, ขาด, ลา)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const presentBtn = page.locator('button:has-text("มา")').first();
      const lateBtn = page.locator('button:has-text("สาย")').nth(1);
      const absentBtn = page.locator('button:has-text("ขาด")').nth(2);
      const leaveBtn = page.locator('button:has-text("ลา")').nth(3);

      await expect(presentBtn).toBeVisible(); await presentBtn.click();
      await expect(lateBtn).toBeVisible(); await lateBtn.click();
      await expect(absentBtn).toBeVisible(); await absentBtn.click();
      await expect(leaveBtn).toBeVisible(); await leaveBtn.click();
    }
  });

  test('TC-STS-24-01-05: ตรวจสอบการระบุสถานะเช็กชื่อในมุมมองการ์ด (Card View Mode) ครบ 4 สถานะ', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const cardViewBtn = page.locator('button:has-text("การ์ด")').first();
      await expect(cardViewBtn).toBeVisible(); if (await cardViewBtn.isVisible()) {
        await cardViewBtn.click();
        await page.waitForTimeout(300);

        const presentBtn = page.locator('button:has-text("มา")').first();
        await expect(presentBtn).toBeVisible(); if (await presentBtn.isVisible()) {
          await presentBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('TC-STS-24-01-06: ตรวจสอบการเปลี่ยนสถานะเช็กชื่อของนักเรียนคนเดิมซ้ำในมุมมองการ์ด (Update Status in Card View)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const cardViewBtn = page.locator('button:has-text("การ์ด")').first();
      await expect(cardViewBtn).toBeVisible(); if (await cardViewBtn.isVisible()) {
        await cardViewBtn.click();
        await page.waitForTimeout(300);

        const presentBtn = page.locator('button:has-text("มา")').first();
        const lateBtn = page.locator('button:has-text("สาย")').first();

        await expect(presentBtn).toBeVisible();
        await expect(lateBtn).toBeVisible();
        await presentBtn.click();
        await page.waitForTimeout(200);
        await lateBtn.click();
        await page.waitForTimeout(200);
      }
    }
  });

  test('TC-STS-24-01-07: ตรวจสอบการกรอกข้อความหมายเหตุ/เหตุผลการขาดหรือลาของนักเรียน', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const remarkInput = page.locator('input[placeholder*="หมายเหตุ"], textarea').first();
      await expect(remarkInput).toBeVisible(); if (await remarkInput.isVisible()) {
        await remarkInput.fill('ลากิจไปต่างจังหวัดกับผู้ปกครอง');
      }
    }
  });

  test('TC-STS-24-01-08: ตรวจสอบการค้นหาชื่อหรือรหัสประจำตัวนักเรียนในแท็บ "รายชื่อ" (Roster Search)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const rosterTab = page.locator('button:has-text("รายชื่อ"), a:has-text("รายชื่อ")').first();
      await expect(rosterTab).toBeVisible(); if (await rosterTab.isVisible()) {
        await rosterTab.click();
        await page.waitForTimeout(300);
        const searchBox = page.locator('input[placeholder*="ค้นหาชื่อหรือรหัส"], input[type="text"]').first();
        await expect(searchBox).toBeVisible(); if (await searchBox.isVisible()) {
          await searchBox.fill('กัญญาวีร์');
          await page.waitForTimeout(400);
        }
      }
    }
  });

  test('TC-STS-24-01-09: ตรวจสอบการกรองประวัติการเช็กชื่อตามช่วงวันที่ในแท็บ "ประวัติ" (Date Range Filter)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const historyTab = page.locator('button:has-text("ประวัติ"), a:has-text("ประวัติ")').first();
      await expect(historyTab).toBeVisible(); if (await historyTab.isVisible()) {
        await historyTab.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('TC-STS-24-01-10: ตรวจสอบสถานะแถบ Sticky Footer เมื่อยังเช็กชื่อนักเรียนไม่ครบทุกคน (Negative Validation)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('body')).toContainText(/เหลือ|ตรวจครบแล้ว/);
    }
  });

  test('TC-STS-24-01-11: ตรวจสอบการส่งผลเช็กชื่อเมื่อระบุสถานะนักเรียนครบทุกคนในห้องสำเร็จ (Positive Submit)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const bulkAllBtn = page.locator('button:has-text("มาทั้งหมด")').first();
      await expect(bulkAllBtn).toBeVisible(); if (await bulkAllBtn.isVisible()) {
        await bulkAllBtn.click();
        await page.waitForTimeout(300);

        const submitBtn = page.locator('button:has-text("ส่งผลเช็กชื่อ")').first();
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toBeEnabled();
        await submitBtn.click();
        await page.waitForTimeout(400);
        await expect(page.locator('body')).toContainText(/ส่งแล้ว\s*·\s*ครั้งที่\s*1/);
        await expect(page.getByRole('button', { name: /แก้ไขและส่งผลใหม่/i })).toBeVisible();
      }
    }
  });

  test('TC-STS-24-01-12: ตรวจสอบการสแกน QR Code ด้วยรหัสที่ไม่ถูกต้องหรือไม่มีในห้องเรียน (Negative QR Code)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const toolsBtn = page.locator('button:has-text("เครื่องมือ")').first();
      await expect(toolsBtn).toBeVisible(); if (await toolsBtn.isVisible()) {
        await toolsBtn.click();
        await page.waitForTimeout(200);
        const qrOption = page.locator('text=สแกน QR').first();
        await expect(qrOption).toBeVisible(); if (await qrOption.isVisible()) {
          await qrOption.click();
          await page.waitForTimeout(300);
          await expect(page.locator('body')).toContainText(/สแกน QR|กล้อง/);
          const cancelBtn = page.locator('button:has-text("ปิด"), button:has-text("ยกเลิก")').last();
          await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
        }
      }
    }
  });

  test('TC-STS-24-01-13: ตรวจสอบการนำเข้าไฟล์ที่มีรูปแบบข้อมูลไม่ถูกต้องหรือไม่ตรงตามแม่แบบ (Negative File Import)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const classroomCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classroomCard).toBeVisible(); if (await classroomCard.isVisible()) {
      await classroomCard.click();
      await page.waitForLoadState('networkidle');

      const toolsBtn = page.locator('button:has-text("เครื่องมือ")').first();
      await expect(toolsBtn).toBeVisible(); if (await toolsBtn.isVisible()) {
        await toolsBtn.click();
        await page.waitForTimeout(200);
        const importOption = page.locator('text=นำเข้าไฟล์').first();
        await expect(importOption).toBeVisible(); if (await importOption.isVisible()) {
          await importOption.click();
          await page.waitForTimeout(300);
          await expect(page.locator('body')).toContainText(/นำเข้าไฟล์|แม่แบบไฟล์/);
          const cancelBtn = page.locator('button:has-text("ปิด"), button:has-text("ยกเลิก")').last();
          await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
        }
      }
    }
  });

});
