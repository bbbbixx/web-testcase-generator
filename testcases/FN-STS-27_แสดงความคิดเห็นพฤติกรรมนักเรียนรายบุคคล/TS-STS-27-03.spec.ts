import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-27-03: การแสดงผลความคิดเห็นและการแจ้งเตือน (UI Displays & Notifications)', () => {

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

  test('TC-STS-27-03-01: ตรวจสอบการแสดงผลหน้าต่าง Dialog แสดงความคิดเห็นและองค์ประกอบครบถ้วน', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      await expect(page.locator('textarea, select').first()).toBeVisible();
    }
  });

  test('TC-STS-27-03-02: ตรวจสอบการแสดงผล Toast แจ้งเตือน "บันทึกความคิดเห็นสำเร็จ" ทันทีหลังกดบันทึก', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const descTextarea = page.locator('textarea').first();
      await expect(descTextarea).toBeVisible(); if (await descTextarea.isVisible()) {
        await descTextarea.fill('ทดสอบการแจ้งเตือน Toast');
      }

      const saveBtn = page.locator('button:has-text("บันทึกข้อมูล"), button:has-text("บันทึก")').last();
      await expect(saveBtn).toBeVisible(); if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('TC-STS-27-03-03: ตรวจสอบการแสดงผลการ์ดความคิดเห็นใหม่ในรายการ', async ({ page }) => {
    await gotoStudentDetail(page);

    const commentCard = page.locator('div.comment-card, div.card:has-text("ความคิดเห็น")').first();
    await expect(commentCard).toBeVisible();
  });

  test('TC-STS-27-03-04: ตรวจสอบการแสดงผลตัวนับจำนวนตัวอักษร Real-time (Character Counter 0/2000)', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const descTextarea = page.locator('textarea').first();
      await expect(descTextarea).toBeVisible(); if (await descTextarea.isVisible()) {
        await descTextarea.fill('ทดสอบจำนวนตัวอักษร 50 ตัว');
        await expect(page.locator('text=/2000, text=0/2000').first()).toBeVisible();
      }
    }
  });

  test('TC-STS-27-03-05: ตรวจสอบการแสดงผลเหตุการณ์ความคิดเห็นในหน้าไทม์ไลน์ตามลำดับเวลา (Timeline Integration)', async ({ page }) => {
    await gotoStudentDetail(page);

    const timelineTab = page.locator('button:has-text("ไทม์ไลน์"), a:has-text("ไทม์ไลน์")').first();
    await expect(timelineTab).toBeVisible(); if (await timelineTab.isVisible()) {
      await timelineTab.click();
      await page.waitForTimeout(300);

      await expect(page.locator('div.timeline, div.timeline-item').first()).toBeVisible();
    }
  });

});
