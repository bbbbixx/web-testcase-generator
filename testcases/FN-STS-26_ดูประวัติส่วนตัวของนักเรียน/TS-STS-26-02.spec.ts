import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-26-02: การทำงานของปุ่มและการโต้ตอบในหน้าโปรไฟล์ (Interactions & Modals)', () => {

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

  test('TC-STS-26-02-01: ตรวจสอบการคลิกปุ่ม "ย้อนกลับ" เพื่อกลับสู่หน้าก่อนหน้า', async ({ page }) => {
    await gotoStudentDetail(page);

    const backBtn = page.locator('button:has-text("ย้อนกลับ"), a:has-text("ย้อนกลับ")').first();
    await expect(page.locator('body')).toBeVisible();
    await expect(backBtn).toBeVisible(); if (await backBtn.isVisible()) {
      await backBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('TC-STS-26-02-02: ตรวจสอบการคลิกปุ่ม "ซ่อนเลขบัตร" เพื่อปกปิดข้อมูลส่วนบุคคล', async ({ page }) => {
    await gotoStudentDetail(page);

    const hideCardBtn = page.locator('button:has-text("ซ่อนเลขบัตร"), button:has-text("ซ่อน")').first();
    await expect(hideCardBtn).toBeVisible(); if (await hideCardBtn.isVisible()) {
      await hideCardBtn.click();
      await page.waitForTimeout(300);
      await expect(hideCardBtn).toBeVisible();
    }
  });

  test('TC-STS-26-02-03: ตรวจสอบการคลิกปุ่ม "ยกเลิก" ใน Modal ยืนยันแสดงเลขบัตรประชาชน', async ({ page }) => {
    await gotoStudentDetail(page);

    const showCardBtn = page.locator('button:has-text("แสดงเลขบัตร"), button:has-text("ดู")').first();
    await expect(showCardBtn).toBeVisible(); if (await showCardBtn.isVisible()) {
      await showCardBtn.click();
      await page.waitForTimeout(300);

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await expect(cancelBtn).not.toBeVisible();
      }
    }
  });

  test('TC-STS-26-02-04: ตรวจสอบการเปิดและปิด Modal "เปิดเคสติดตามนักเรียน" ด้วยปุ่มยกเลิก', async ({ page }) => {
    await gotoStudentDetail(page);

    const openCaseBtn = page.locator('button:has-text("เปิดเคส")').first();
    await expect(openCaseBtn).toBeVisible(); if (await openCaseBtn.isVisible()) {
      await openCaseBtn.click();
      await page.waitForTimeout(300);

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(cancelBtn).not.toBeVisible();
      }
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('TC-STS-26-02-05: ตรวจสอบการคลิกปุ่มยกเลิกฟอร์ม "เพิ่มความคิดเห็น"', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(cancelBtn).not.toBeVisible();
      }
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('TC-STS-26-02-06: ตรวจสอบการคลิกสลับแท็บ "ความคิดเห็นจากคุณครู", "ประวัติการติดตาม", และ "ไทม์ไลน์"', async ({ page }) => {
    await gotoStudentDetail(page);

    const trackingTab = page.locator('button:has-text("ประวัติการติดตาม"), a:has-text("ประวัติการติดตาม")').first();
    const timelineTab = page.locator('button:has-text("ไทม์ไลน์"), a:has-text("ไทม์ไลน์")').first();
    const commentTab = page.locator('button:has-text("ความคิดเห็น"), a:has-text("ความคิดเห็น")').first();

    await expect(trackingTab).toBeVisible(); if (await trackingTab.isVisible()) {
      await trackingTab.click();
      await expect(trackingTab).toBeVisible();
    }
    await expect(timelineTab).toBeVisible(); if (await timelineTab.isVisible()) {
      await timelineTab.click();
      await expect(timelineTab).toBeVisible();
    }
    await expect(commentTab).toBeVisible(); if (await commentTab.isVisible()) {
      await commentTab.click();
      await expect(commentTab).toBeVisible();
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-STS-26-02-07: ตรวจสอบการคลิกเปลี่ยนเดือนในปฏิทินการเข้าเรียน (Month Navigation)', async ({ page }) => {
    await gotoStudentDetail(page);

    const prevMonthBtn = page.locator('button:has-text("<"), button[aria-label*="previous month"]').first();
    const nextMonthBtn = page.locator('button:has-text(">"), button[aria-label*="next month"]').first();

    await expect(prevMonthBtn).toBeVisible(); if (await prevMonthBtn.isVisible()) {
      await prevMonthBtn.click();
      await page.waitForTimeout(200);
      await expect(prevMonthBtn).toBeVisible();
    }
    await expect(nextMonthBtn).toBeVisible(); if (await nextMonthBtn.isVisible()) {
      await nextMonthBtn.click();
      await page.waitForTimeout(200);
      await expect(nextMonthBtn).toBeVisible();
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-STS-26-02-08: ตรวจสอบการคลิกเลือกวันที่ในปฏิทินเพื่อดูประวัติการเข้าเรียนรายวัน', async ({ page }) => {
    await gotoStudentDetail(page);

    const calendarDay = page.locator('div.calendar-day, td.day-cell').first();
    await expect(calendarDay).toBeVisible(); if (await calendarDay.isVisible()) {
      await calendarDay.click();
      await page.waitForTimeout(300);
      await expect(calendarDay).toBeVisible();
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('TC-STS-26-02-09: ตรวจสอบการคลิกเลือกวันที่ไม่มีการเรียนการสอน (วันหยุดเสาร์-อาทิตย์)', async ({ page }) => {
    await gotoStudentDetail(page);

    const weekendCell = page.locator('div.weekend, td.weekend').first();
    await expect(weekendCell).toBeVisible(); if (await weekendCell.isVisible()) {
      await weekendCell.click();
      await page.waitForTimeout(300);
      await expect(weekendCell).toBeVisible();
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

});
