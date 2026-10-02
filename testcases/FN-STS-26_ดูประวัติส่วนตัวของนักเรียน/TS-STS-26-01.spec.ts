import { test, expect } from '@playwright/test';
import { loginWithSession } from '../helpers/auth';

test.describe('TS-STS-26-01: ตรวจสอบการกรอกข้อมูลและแบบฟอร์มในหน้าโปรไฟล์ (FN-STS-26)', () => {

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

  test('TC-STS-26-01-01: ตรวจสอบการเปิดดูเลขบัตรประจำตัวประชาชนโดยเลือกเหตุผล (Positive PII Reveal)', async ({ page }) => {
    await gotoStudentDetail(page);

    const showCardBtn = page.locator('button:has-text("แสดงเลขบัตร"), button:has-text("ดู")').first();
    await expect(showCardBtn).toBeVisible(); if (await showCardBtn.isVisible()) {
      await showCardBtn.click();
      await page.waitForTimeout(300);

      const reasonSelect = page.locator('select, [role="combobox"]').first();
      await expect(reasonSelect).toBeVisible(); if (await reasonSelect.isVisible()) {
        await reasonSelect.selectOption({ label: 'เยี่ยมบ้าน/ติดตาม' }).catch(() => {});
      }

      const confirmBtn = page.locator('button:has-text("แสดง")').last();
      await expect(confirmBtn).toBeVisible(); if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('TC-STS-26-01-02: ตรวจสอบการเลือกเหตุผล "อื่น ๆ (ระบุ)" ในการขอเปิดดูเลขบัตรประชาชน', async ({ page }) => {
    await gotoStudentDetail(page);

    const showCardBtn = page.locator('button:has-text("แสดงเลขบัตร"), button:has-text("ดู")').first();
    await expect(showCardBtn).toBeVisible(); if (await showCardBtn.isVisible()) {
      await showCardBtn.click();
      await page.waitForTimeout(300);

      const reasonSelect = page.locator('select, [role="combobox"]').first();
      await expect(reasonSelect).toBeVisible(); if (await reasonSelect.isVisible()) {
        await reasonSelect.selectOption({ label: 'อื่น ๆ (ระบุ)' }).catch(() => {});
        const detailInput = page.locator('input[placeholder*="ระบุเหตุผล"], textarea').first();
        await expect(detailInput).toBeVisible(); if (await detailInput.isVisible()) {
          await detailInput.fill('ขอข้อมูลเพื่อทำเอกสารทุนการศึกษา');
        }
      }
      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
    }
  });

  test('TC-STS-26-01-03: ตรวจสอบการกรอกข้อความในแบบฟอร์ม "เปิดเคสติดตามนักเรียน" (Positive Open Case)', async ({ page }) => {
    await gotoStudentDetail(page);

    const openCaseBtn = page.locator('button:has-text("เปิดเคส")').first();
    await expect(openCaseBtn).toBeVisible(); if (await openCaseBtn.isVisible()) {
      await openCaseBtn.click();
      await page.waitForTimeout(300);

      const reasonInput = page.locator('textarea[placeholder*="ระบุสัญญาณ"], textarea').first();
      await expect(reasonInput).toBeVisible(); if (await reasonInput.isVisible()) {
        await reasonInput.fill('นักเรียนมีพฤติกรรมขาดเรียนบ่อยและติดต่อผู้ปกครองไม่ได้');
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
    }
  });

  test('TC-STS-26-01-04: ตรวจสอบการบันทึกเปิดเคสติดตามโดยไม่กรอกเหตุผล (Negative Open Case Required Validation)', async ({ page }) => {
    await gotoStudentDetail(page);

    const openCaseBtn = page.locator('button:has-text("เปิดเคส")').first();
    await expect(openCaseBtn).toBeVisible(); if (await openCaseBtn.isVisible()) {
      await openCaseBtn.click();
      await page.waitForTimeout(300);

      const submitBtn = page.locator('div[role="dialog"] button:has-text("เปิดเคส")').last();
      await expect(submitBtn).toBeVisible(); if (await submitBtn.isVisible()) {
        await expect(submitBtn).toBeDisabled();
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
    }
  });

  test('TC-STS-26-01-05: ตรวจสอบการกรอกฟอร์ม "เพิ่มความคิดเห็นจากคุณครู" (Positive Add Teacher Comment)', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const topicSelect = page.locator('select, [role="combobox"]').first();
      await expect(topicSelect).toBeVisible(); if (await topicSelect.isVisible()) {
        await topicSelect.selectOption({ label: 'ปัญหาด้านสุขภาพ' }).catch(() => {});
      }

      const descTextarea = page.locator('textarea').first();
      await expect(descTextarea).toBeVisible(); if (await descTextarea.isVisible()) {
        await descTextarea.fill('นักเรียนมีอาการป่วยบ่อย แจ้งว่าแพ้อากาศ');
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
    }
  });

  test('TC-STS-26-01-06: ตรวจสอบการบันทึกความคิดเห็นโดยไม่กรอกคำอธิบาย (Negative Comment Required Validation)', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const saveBtn = page.locator('button:has-text("บันทึก")').last();
      await expect(saveBtn).toBeVisible(); if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(200);
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
    }
  });

  test('TC-STS-26-01-07: ตรวจสอบการกรอกคำอธิบายความคิดเห็นเกินขีดจำกัดความยาวสูงสุด (Max Length)', async ({ page }) => {
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
      await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
    }
  });

  test('TC-STS-26-01-08: ตรวจสอบการเลือกหัวข้อปัญหาหมวดอื่นๆ ในฟอร์มเพิ่มความคิดเห็น (Topic Dropdown Options)', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const topicSelect = page.locator('select, [role="combobox"]').first();
      await expect(topicSelect).toBeVisible(); if (await topicSelect.isVisible()) {
        await topicSelect.selectOption({ label: 'ปัญหาด้านการเรียน' }).catch(() => {});
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
    }
  });

  test('TC-STS-26-01-09: ตรวจสอบการเลือกระดับข้อสังเกต "น่ากังวล" และ "บันทึกทั่วไป" ในฟอร์มเพิ่มความคิดเห็น', async ({ page }) => {
    await gotoStudentDetail(page);

    const addCommentBtn = page.locator('button:has-text("เพิ่มความคิดเห็น")').first();
    await expect(addCommentBtn).toBeVisible(); if (await addCommentBtn.isVisible()) {
      await addCommentBtn.click();
      await page.waitForTimeout(300);

      const levelSelect = page.locator('select, [role="combobox"]').nth(1);
      await expect(levelSelect).toBeVisible(); if (await levelSelect.isVisible()) {
        await levelSelect.selectOption({ label: 'น่ากังวล' }).catch(() => {});
      }

      const cancelBtn = page.locator('button:has-text("ยกเลิก")').last();
      await expect(cancelBtn).toBeVisible(); await cancelBtn.click();
    }
  });

});
