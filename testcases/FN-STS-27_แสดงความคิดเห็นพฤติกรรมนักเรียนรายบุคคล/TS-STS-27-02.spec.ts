import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-27-02: การทำงานของปุ่มและการโต้ตอบ (Button Actions & Modal Dismissal)', () => {

  test.beforeEach(async ({ page }) => {
    await loginWithSession(page, 'burapha.admin', '11111111');
  });

  const gotoStudentDetail = async (page: any) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');
    const classCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classCard).toBeVisible(); if (await classCard.isVisible()) {
      await classCard.click();
      await page.waitForLoadState('networkidle');

      const rosterTab = page.locator('button:has-text("รายชื่อ"), a:has-text("รายชื่อ")').first();
      await expect(rosterTab).toBeVisible(); if (await rosterTab.isVisible()) {
        await rosterTab.click();
        await page.waitForTimeout(300);

        const studentRow = page.locator('tr, div.student-item, a[href*="/classroom/students/"]').first();
        await expect(studentRow).toBeVisible(); if (await studentRow.isVisible()) {
          await studentRow.click();
          await page.waitForLoadState('networkidle');
        }
      }
    }
  };

  test('TC-STS-27-02-01: ตรวจสอบการคลิกปุ่ม "เพิ่มความคิดเห็น" จากหน้ารายชื่อห้องเรียน (Classroom Roster Action)', async ({ page }) => {
    await page.goto('/classroom');
    await page.waitForLoadState('networkidle');
    const classCard = page.locator('div.card, a[href*="/classroom/check-in/"]').first();
    await expect(classCard).toBeVisible(); if (await classCard.isVisible()) {
      await classCard.click();
      await page.waitForLoadState('networkidle');

      const rosterTab = page.locator('button:has-text("รายชื่อ"), a:has-text("รายชื่อ")').first();
      await expect(rosterTab).toBeVisible(); if (await rosterTab.isVisible()) {
        await rosterTab.click();
        await page.waitForTimeout(300);

        const rowCommentBtn = page.locator('table tbody button:has-text("เพิ่มความคิดเห็น"), table tbody button:has-text("ความคิดเห็น")').first();
        await expect(rowCommentBtn).toBeVisible(); if (await rowCommentBtn.isVisible()) {
          await rowCommentBtn.click();
          await page.waitForTimeout(300);
          await expect(page.locator('text=ความคิดเห็น, text=เพิ่มความคิดเห็น').first()).toBeVisible();
        }
      }
    }
  });

  test('TC-STS-27-02-02: ตรวจสอบการคลิกปุ่ม "+ เพิ่มความคิดเห็น" จากหน้าโปรไฟล์นักเรียน', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('textarea, select').first()).toBeVisible();
    }
  });

  test('TC-STS-27-02-03: ตรวจสอบการคลิกปุ่ม "ยกเลิก" บนฟอร์มเพิ่มความคิดเห็น', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await page.waitForTimeout(200);
      }
    }
  });

  test('TC-STS-27-02-04: ตรวจสอบการกดปุ่ม "Escape" หรือคลิกนอก Modal เพื่อปิดหน้าต่างบันทึกความคิดเห็น', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }
  });

  test('TC-STS-27-02-05: ตรวจสอบการคลิกปุ่ม "บันทึกข้อมูล" ขณะที่ฟอร์มกรอกข้อมูลถูกต้องสมบูรณ์', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const descTextarea = page.locator('textarea').first();
      await expect(descTextarea).toBeVisible(); if (await descTextarea.isVisible()) {
        await descTextarea.fill('นักเรียนมีการพัฒนาด้านการเรียนดีขึ้น');
      }

      const saveBtn = page.locator('button:has-text("บันทึกข้อมูล"), button:has-text("บันทึก")').last();
      await expect(saveBtn).toBeVisible(); if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });

});
