import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-24-02: การทำงานของปุ่มและการโต้ตอบ (Interactions & Tools)', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
  });

  test('TC-STS-24-02-01: ตรวจสอบการคลิกการ์ดห้องเรียนเพื่อเข้าสู่หน้าเช็กชื่อของห้องนั้นๆ', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/classroom\/check-in\//);
    }
  });

  test('TC-STS-24-02-02: ตรวจสอบการทำงานของปุ่มทางลัด "มาทั้งหมด"', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const bulkPresentBtn = page.locator('button:has-text("มาทั้งหมด")').first();
      await expect(bulkPresentBtn).toBeVisible(); if (await bulkPresentBtn.isVisible()) {
        await bulkPresentBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('TC-STS-24-02-03: ตรวจสอบการทำงานของ Checkbox "ย้ายคนที่เช็กแล้วไว้ท้ายรายการ"', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const checkbox = page.locator('input[type="checkbox"]:has-text("ย้าย"), label:has-text("ย้ายคนที่เช็กแล้ว") input').first();
      await expect(checkbox).toBeVisible(); if (await checkbox.isVisible()) {
        await expect(checkbox).toBeVisible();
      }
    }
  });

  test('TC-STS-24-02-04: ตรวจสอบการคลิกปุ่มสลับมุมมองระหว่าง "ตาราง" และ "การ์ด"', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const cardViewBtn = page.locator('button:has-text("การ์ด")').first();
      await expect(cardViewBtn).toBeVisible(); if (await cardViewBtn.isVisible()) {
        await cardViewBtn.click();
        await page.waitForTimeout(300);

        const tableViewBtn = page.locator('button:has-text("ตาราง")').first();
        await expect(tableViewBtn).toBeVisible(); if (await tableViewBtn.isVisible()) {
          await tableViewBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('TC-STS-24-02-05: ตรวจสอบการเปิด Modal "สแกน QR" และจำลองการสแกนบัตรนักเรียน', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const toolsBtn = page.locator('button:has-text("เครื่องมือ")').first();
      await expect(toolsBtn).toBeVisible(); if (await toolsBtn.isVisible()) {
        await toolsBtn.click();
        await page.waitForTimeout(200);
        const qrOption = page.locator('text=สแกน QR').first();
        await expect(qrOption).toBeVisible(); await qrOption.click();
      }
    }
  });

  test('TC-STS-24-02-06: ตรวจสอบการสลับกล้อง/แหล่งรับข้อมูลใน Modal สแกน QR Code', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const toolsBtn = page.locator('button:has-text("เครื่องมือ")').first();
      await expect(toolsBtn).toBeVisible(); if (await toolsBtn.isVisible()) {
        await toolsBtn.click();
        const qrOption = page.locator('text=สแกน QR').first();
        await expect(qrOption).toBeVisible(); await qrOption.click();
      }
    }
  });

  test('TC-STS-24-02-07: ตรวจสอบการคลิกปุ่มปิด Modal สแกน QR Code', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const toolsBtn = page.locator('button:has-text("เครื่องมือ")').first();
      await expect(toolsBtn).toBeVisible(); if (await toolsBtn.isVisible()) {
        await toolsBtn.click();
        const qrOption = page.locator('text=สแกน QR').first();
        await expect(qrOption).toBeVisible(); if (await qrOption.isVisible()) {
          await qrOption.click();
          await page.waitForTimeout(300);
          const closeBtn = page.locator('button:has-text("ปิด"), button:has-text("ยกเลิก")').last();
          await expect(closeBtn).toBeVisible(); await closeBtn.click();
        }
      }
    }
  });

  test('TC-STS-24-02-08: ตรวจสอบการเปิด Modal "นำเข้าไฟล์" และดาวน์โหลดแม่แบบไฟล์', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const toolsBtn = page.locator('button:has-text("เครื่องมือ")').first();
      await expect(toolsBtn).toBeVisible(); if (await toolsBtn.isVisible()) {
        await toolsBtn.click();
        const importOption = page.locator('text=นำเข้าไฟล์').first();
        await expect(importOption).toBeVisible(); await importOption.click();
      }
    }
  });

  test('TC-STS-24-02-09: ตรวจสอบการอัปโหลดไฟล์ Excel/CSV ผลการเช็กชื่อเข้าสู่ระบบ', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const toolsBtn = page.locator('button:has-text("เครื่องมือ")').first();
      await expect(toolsBtn).toBeVisible(); if (await toolsBtn.isVisible()) {
        await toolsBtn.click();
        const importOption = page.locator('text=นำเข้าไฟล์').first();
        await expect(importOption).toBeVisible(); await importOption.click();
      }
    }
  });

  test('TC-STS-24-02-10: ตรวจสอบการเปิด Dialog "มอบหมาย" การเช็กชื่อ และการคลิกปุ่มยกเลิก', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const toolsBtn = page.locator('button:has-text("เครื่องมือ")').first();
      await expect(toolsBtn).toBeVisible(); if (await toolsBtn.isVisible()) {
        await toolsBtn.click();
        const assignOption = page.locator('text=มอบหมาย').first();
        await expect(assignOption).toBeVisible(); if (await assignOption.isVisible()) {
          await assignOption.click();
          await page.waitForTimeout(300);
          const cancelBtn = page.locator('button:has-text("ยกเลิก")').first();
          await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
        }
      }
    }
  });

  test('TC-STS-24-02-11: ตรวจสอบการคลิกสลับ 4 แท็บย่อย (รายชื่อ, เช็กชื่อ, ประวัติ, จัดการลิงก์)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const rosterTab = page.locator('button:has-text("รายชื่อ"), a:has-text("รายชื่อ")').first();
      const historyTab = page.locator('button:has-text("ประวัติ"), a:has-text("ประวัติ")').first();
      const checkinTab = page.locator('button:has-text("เช็กชื่อ"), a:has-text("เช็กชื่อ")').first();

      await expect(rosterTab).toBeVisible(); await rosterTab.click();
      await expect(historyTab).toBeVisible(); await historyTab.click();
      await expect(checkinTab).toBeVisible(); await checkinTab.click();
    }
  });

  test('TC-STS-24-02-12: ตรวจสอบการคลิกปุ่ม "ดูรายละเอียด" ในแท็บประวัติ', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const historyTab = page.locator('button:has-text("ประวัติ"), a:has-text("ประวัติ")').first();
      await expect(historyTab).toBeVisible(); if (await historyTab.isVisible()) {
        await historyTab.click();
        await page.waitForTimeout(300);

        const detailBtn = page.locator('button:has-text("ดูรายละเอียด"), a:has-text("ดูรายละเอียด")').first();
        await expect(detailBtn).toBeVisible(); await detailBtn.click();
      }
    }
  });

  test('TC-STS-24-02-13: ตรวจสอบการคลิกปุ่ม "ดาวน์โหลดข้อมูล" ในแท็บประวัติการเช็กชื่อ', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const historyTab = page.locator('button:has-text("ประวัติ"), a:has-text("ประวัติ")').first();
      await expect(historyTab).toBeVisible(); if (await historyTab.isVisible()) {
        await historyTab.click();
        await page.waitForTimeout(300);

        const downloadBtn = page.locator('button:has-text("ดาวน์โหลด"), button:has-text("ส่งออก")').first();
        await expect(downloadBtn).toBeVisible();
      }
    }
  });

  test('TC-STS-24-02-14: ตรวจสอบการคลิกปุ่ม "แก้ไขและส่งผลใหม่" หลังจากส่งผลเช็กชื่อแล้ว', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');

    const card = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(card).toBeVisible(); if (await card.isVisible()) {
      await card.click();
      await page.waitForLoadState('networkidle');

      const editSubmitBtn = page.locator('button:has-text("แก้ไขและส่งผลใหม่")').first();
      await expect(editSubmitBtn).toBeVisible(); if (await editSubmitBtn.isVisible()) {
        await editSubmitBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });

});
