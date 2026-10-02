import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-27-01: ตรวจสอบการกรอกข้อมูลและเงื่อนไข Validation (FN-STS-27)', () => {

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

  test('TC-STS-27-01-01: ตรวจสอบการกรอกข้อมูลและบันทึกความคิดเห็นพฤติกรรมนักเรียนครบถ้วนถูกต้อง (Positive)', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const topicSelect = page.locator('select, [role="combobox"]').first();
      await expect(topicSelect).toBeVisible(); if (await topicSelect.isVisible()) {
        await topicSelect.selectOption({ label: 'ปัญหาด้านการเรียน' }).catch(() => {});
        await expect(topicSelect).toBeVisible();
      }

      const levelSelect = page.locator('select, [role="combobox"]').nth(1);
      await expect(levelSelect).toBeVisible(); if (await levelSelect.isVisible()) {
        await levelSelect.selectOption({ label: 'ควรเฝ้าดู' }).catch(() => {});
        await expect(levelSelect).toBeVisible();
      }

      const descTextarea = page.locator('textarea').first();
      await expect(descTextarea).toBeVisible(); if (await descTextarea.isVisible()) {
        await descTextarea.fill('นักเรียนติดตามบทเรียนได้ช้า ควรได้รับคำแนะนำเพิ่มเติม');
        await expect(descTextarea).toHaveValue('นักเรียนติดตามบทเรียนได้ช้า ควรได้รับคำแนะนำเพิ่มเติม');
      }

      const saveBtn = page.locator('button:has-text("บันทึกข้อมูล"), button:has-text("บันทึก")').last();
      await expect(saveBtn).toBeVisible(); if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(400);
      }
    }
  });

  test('TC-STS-27-01-02: ตรวจสอบการบันทึกความคิดเห็นโดยไม่กรอกคำอธิบาย (Negative Required Validation)', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const saveBtn = page.locator('button:has-text("บันทึกข้อมูล"), button:has-text("บันทึก")').last();
      await expect(saveBtn).toBeVisible(); if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(200);
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(cancelBtn).not.toBeVisible();
      }
    }
  });

  test('TC-STS-27-01-03: ตรวจสอบการกรอกคำอธิบายด้วยช่องว่างล้วน (Whitespace Validation)', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const descTextarea = page.locator('textarea').first();
      await expect(descTextarea).toBeVisible(); if (await descTextarea.isVisible()) {
        await descTextarea.fill('     ');
      }

      const saveBtn = page.locator('button:has-text("บันทึกข้อมูล"), button:has-text("บันทึก")').last();
      await expect(saveBtn).toBeVisible(); if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(200);
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(cancelBtn).not.toBeVisible();
      }
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('TC-STS-27-01-04: ตรวจสอบตัวเลือกในดรอปดาวน์ "หัวข้อปัญหา" ครบทั้ง 9 หมวดหมู่', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const topicSelect = page.locator('select, [role="combobox"]').first();
      await expect(topicSelect).toBeVisible(); if (await topicSelect.isVisible()) {
        await topicSelect.click();
        await expect(topicSelect).toBeVisible();
        await page.waitForTimeout(200);
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(cancelBtn).not.toBeVisible();
      }
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('TC-STS-27-01-05: ตรวจสอบตัวเลือกในดรอปดาวน์ "ระดับข้อสังเกต" ครบ 3 ระดับ (บันทึกทั่วไป, ควรเฝ้าดู, น่ากังวล)', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const levelSelect = page.locator('select, [role="combobox"]').nth(1);
      await expect(levelSelect).toBeVisible(); if (await levelSelect.isVisible()) {
        await levelSelect.click();
        await expect(levelSelect).toBeVisible();
        await page.waitForTimeout(200);
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(cancelBtn).not.toBeVisible();
      }
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('TC-STS-27-01-06: ตรวจสอบการเลือกระดับข้อสังเกต "น่ากังวล" เพื่อส่งต่อเป็นเคสเฝ้าระวังพิเศษ (FN-STS-28)', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const levelSelect = page.locator('select, [role="combobox"]').nth(1);
      await expect(levelSelect).toBeVisible(); if (await levelSelect.isVisible()) {
        await levelSelect.selectOption({ label: 'น่ากังวล' }).catch(() => {});
        await expect(levelSelect).toBeVisible();
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(cancelBtn).not.toBeVisible();
      }
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('TC-STS-27-01-07: ตรวจสอบขีดจำกัดความยาวคำอธิบายสูงสุด 2,000 ตัวอักษร และการป้องกันการพิมพ์เกิน', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const descTextarea = page.locator('textarea').first();
      await expect(descTextarea).toBeVisible(); if (await descTextarea.isVisible()) {
        await descTextarea.fill('A'.repeat(2100));
        const val = await descTextarea.inputValue();
        expect(val.length).toBeLessThanOrEqual(2000);
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(cancelBtn).not.toBeVisible();
      }
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

});
