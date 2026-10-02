import { test, expect } from '@playwright/test';

/**
 * ฟังก์ชัน: FN-STS-02 แก้ไขข้อมูลส่วนตัว
 * หน้าจอ: SC-STS-02-01 ตรวจสอบหน้าจอแก้ไขข้อมูลส่วนตัว
 * ชุดทดสอบ: TS-STS-02-01 ตรวจสอบการกรอกข้อมูล (Input & Form Validations)
 */
test.describe('FN-STS-02 แก้ไขข้อมูลส่วนตัว - TS-STS-02-01 ตรวจสอบการกรอกข้อมูล', () => {
  const loginUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/login` : 'https://sts-frontend-gold.vercel.app/login';
  const profileUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/profile` : 'https://sts-frontend-gold.vercel.app/profile';
  const changePasswordUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/change-password` : 'https://sts-frontend-gold.vercel.app/change-password';

  async function performLogin(page: any, user: string, pass: string) {
    await page.goto(loginUrl);
    await page.waitForLoadState('networkidle');

    for (let attempt = 0; attempt < 6; attempt++) {
      if (page.url().includes('/login')) {
        const userInput = page.getByPlaceholder('กรอกชื่อผู้ใช้งาน');
        await userInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        await userInput.fill(user);
        const passInput = page.getByPlaceholder('กรอกรหัสผ่าน');
        await passInput.fill(pass);
        await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

        const navPromise = page.waitForURL((url: URL) => !url.pathname.includes('/login'), {
          waitUntil: 'domcontentloaded',
          timeout: 8000,
        }).then(() => 'success').catch(() => null);

        const rateLimitPromise = page.waitForSelector('text=คำขอมากเกินไป', {
          timeout: 3000,
        }).then(() => 'ratelimit').catch(() => null);

        const outcome = await Promise.race([navPromise, rateLimitPromise]);
        if (outcome === 'success') {
          await page.waitForSelector('header, aside', { timeout: 15000 }).catch(() => {});
          return;
        }
        if (outcome === 'ratelimit') {
          await page.waitForTimeout(15000);
        } else {
          await page.waitForTimeout(3000);
        }
      } else {
        return;
      }
    }
    await expect(page).not.toHaveURL(/.*login.*/, { timeout: 15000 });
  }

  test.beforeEach(async ({ page }) => {
    await performLogin(page, 'burapha.director', '11111111');
    await page.goto(profileUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=ข้อมูลทั่วไป', { timeout: 15000 }).catch(() => {});
  });

  test('TC-STS-02-01-01: ตรวจสอบการแก้ไขชื่อจริงและนามสกุลด้วยข้อความถูกต้อง (Positive Case)', async ({ page }) => {
    // 1. เข้าสู่หน้าโปรไฟล์ของฉัน (/profile)
    await expect(page).toHaveURL(/.*profile/);

    // 2. คลิกปุ่ม "แก้ไขข้อมูลส่วนตัว"
    const editBtn = page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i });
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    const now = Date.now().toString().slice(-4);
    const testFirstName = `สมศักดิ์${now}`;
    const testLastName = `รักเรียน${now}`;

    // 3. กรอกช่อง ชื่อจริง
    const firstNameInput = page.locator('#FirstName');
    await firstNameInput.fill(testFirstName);

    // 4. กรอกช่อง นามสกุล
    const lastNameInput = page.locator('#LastName');
    await lastNameInput.fill(testLastName);

    // 5. คลิกปุ่ม "บันทึกข้อมูล"
    const saveBtn = page.getByRole('button', { name: 'บันทึก', exact: true });
    await saveBtn.click();

    // Expected: แสดง Toast หรือชื่ออัปเดต หรือคืนค่าเดิมเพื่อไม่กระทบข้อมูลหลัก
    await page.waitForTimeout(1000);
    const reEditBtn = page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i });
    await expect(reEditBtn).toBeVisible(); if (await reEditBtn.isVisible()) {
      await reEditBtn.click();
    }
    await page.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  });

  test('TC-STS-02-01-02: ตรวจสอบกรณีลบชื่อหรือนามสกุลเป็นค่าว่าง (Required Field Validation)', async ({ page }) => {
    // 1. เข้าสู่โหมดแก้ไขข้อมูลส่วนตัว
    const editBtn = page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i });
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    // 2. ลบข้อความในช่อง ชื่อจริง ให้ว่างเปล่า
    const firstNameInput = page.locator('#FirstName');
    await firstNameInput.fill('');
    await firstNameInput.blur();

    // 3. คลิกปุ่ม "บันทึกข้อมูล"
    const saveBtn = page.getByRole('button', { name: 'บันทึก', exact: true });
    await expect(saveBtn).toBeVisible();
    if (await saveBtn.isEnabled()) {
      await saveBtn.click();
    } else {
      await expect(saveBtn).toBeDisabled();
    }

    // Expected Result ตามเอกสาร: แจ้ง "กรุณากรอกชื่อจริง" และไม่อนุญาตให้บันทึก
    await expect(page.getByText('กรุณากรอกชื่อจริง')).toBeVisible();
    await page.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  });

  test('TC-STS-02-01-03: ตรวจสอบการกรอกเบอร์โทรศัพท์ไม่ถูกต้อง (Invalid Phone Number Format)', async ({ page }) => {
    // 1. เข้าสู่โหมดแก้ไขข้อมูลส่วนตัว
    const editBtn = page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i });
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    // 2. กรอกช่อง เบอร์โทรศัพท์ ด้วย "08123" (5 หลัก)
    const phoneInput = page.locator('#phone');
    await phoneInput.fill('08123');
    await phoneInput.blur();

    // 3. คลิกปุ่ม "บันทึกข้อมูล"
    const saveBtn = page.getByRole('button', { name: 'บันทึก', exact: true });
    await expect(saveBtn).toBeVisible();
    if (await saveBtn.isEnabled()) {
      await saveBtn.click();
    } else {
      await expect(saveBtn).toBeDisabled();
    }

    // Expected Result ตามเอกสาร: แสดงข้อความแจ้งเตือนรูปแบบเบอร์โทรศัพท์
    await expect(page.getByText(/เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก/i)).toBeVisible();
    await page.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  });

  test('TC-STS-02-01-04: ตรวจสอบการกรอกเบอร์โทรศัพท์ต้องไม่เกินความยาวเบอร์โทรศัพท์ไทย (Max Length 10 Digits)', async ({ page }) => {
    // 1. เข้าสู่หน้าโปรไฟล์ของฉัน (/profile)
    await expect(page).toHaveURL(/.*profile/);

    // 2. คลิกปุ่ม "แก้ไขข้อมูลส่วนตัว"
    const editBtn = page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i });
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    // 3. กรอกช่อง เบอร์โทรศัพท์ ด้วยตัวเลขเกิน 10 หลัก ("081234567890123" - 15 หลัก)
    const phoneInput = page.locator('#phone');
    await phoneInput.fill('081234567890123');
    await phoneInput.blur();

    // 4. สังเกตตัวเลขที่แสดงในช่องและคลิกปุ่ม "บันทึกข้อมูล"
    const val = await phoneInput.inputValue();
    expect(val.length).toBeLessThanOrEqual(10);

    const saveBtn = page.getByRole('button', { name: 'บันทึก', exact: true });
    await expect(saveBtn).toBeVisible();
    if (await saveBtn.isEnabled()) {
      await saveBtn.click();
    } else {
      await expect(saveBtn).toBeDisabled();
    }

    await page.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  });

  test('TC-STS-02-01-05: ตรวจสอบการกรอกรูปแบบอีเมลไม่ถูกต้อง (Invalid Email Format)', async ({ page }) => {
    // 1. เข้าสู่โปรไฟล์ของฉัน (/profile)
    await expect(page).toHaveURL(/.*profile/);

    // 2. คลิกปุ่ม "แก้ไขข้อมูลส่วนตัว"
    const editBtn = page.getByRole('button', { name: /แก้ไขข้อมูลส่วนตัว/i });
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    // 3. กรอกช่อง กรอกอีเมล = "somchai.email.com"
    const emailInput = page.locator('#email');
    await emailInput.fill('somchai.email.com');
    await emailInput.blur();

    // 4. ระบบแสดงข้อความแจ้งเตือนทันทีโดยยังไม่ต้องกดบันทึก (หรือแสดง validation error)
    const errorMsg = page.getByText(/รูปแบบอีเมลไม่ถูกต้อง/i).or(page.getByText(/อีเมลไม่ถูกต้อง/i));
    await expect(errorMsg).toBeVisible({ timeout: 5000 });

    // 5. หากปุ่มบันทึกกดได้ ให้ลองกดบันทึกตาม step
    const saveBtn = page.getByRole('button', { name: 'บันทึก', exact: true });
    await expect(saveBtn).toBeVisible();
    if (await saveBtn.isEnabled()) {
      await saveBtn.click();
    } else {
      await expect(saveBtn).toBeDisabled();
    }
    await expect(errorMsg).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  });

  test('TC-STS-02-01-06: ตรวจสอบการเปลี่ยนรหัสผ่านเมื่อไม่กรอกข้อมูล (Empty Fields Validation)', async ({ page }) => {
    // 1. เข้าสู่หน้า "เปลี่ยนรหัสผ่าน" (/change-password)
    await page.goto(changePasswordUrl);
    await page.waitForLoadState('networkidle');

    // 2. เว้นว่างทุกช่อง (ค่าว่างอยู่แล้ว)
    // 3. คลิกปุ่ม "บันทึกรหัสผ่านใหม่"
    const submitBtn = page.getByRole('button', { name: 'บันทึกรหัสผ่านใหม่', exact: true });
    await submitBtn.click();

    await expect(page.getByText('กรุณากรอกรหัสผ่านเดิม')).toBeVisible();
  });

  test('TC-STS-02-01-07: ตรวจสอบการเปลี่ยนรหัสผ่านใหม่น้อยกว่า 8 ตัวอักษร (Min Length Validation)', async ({ page }) => {
    // 1. เข้าสู่หน้าเปลี่ยนรหัสผ่าน
    await page.goto(changePasswordUrl);
    await page.waitForLoadState('networkidle');

    // 2. กรอกรหัสผ่านเดิม "11111111"
    await page.locator('#currentPassword').fill('11111111');

    // 3. กรอกรหัสผ่านใหม่ "1234" (4 ตัวอักษร)
    await page.locator('#newPassword').fill('1234');
    await page.locator('#confirmPassword').fill('1234');

    // 4. คลิกปุ่ม "บันทึกรหัสผ่านใหม่"
    await page.getByRole('button', { name: 'บันทึกรหัสผ่านใหม่', exact: true }).click();

    await expect(page.getByText('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')).toBeVisible();
  });

  test('TC-STS-02-01-08: ตรวจสอบการเปลี่ยนรหัสผ่านใหม่เมื่อรหัสยืนยันไม่ตรงกัน (Password Mismatch)', async ({ page }) => {
    // 1. เข้าสู่หน้าเปลี่ยนรหัสผ่าน
    await page.goto(changePasswordUrl);
    await page.waitForLoadState('networkidle');

    // 2. กรอกรหัสผ่านเดิม "11111111"
    await page.locator('#currentPassword').fill('11111111');

    // 3. กรอกรหัสผ่านใหม่ "Password123"
    await page.locator('#newPassword').fill('Password123');

    // 4. กรอกยืนยันรหัสผ่านใหม่ "Password999"
    await page.locator('#confirmPassword').fill('Password999');

    // 5. คลิกปุ่ม "บันทึกรหัสผ่านใหม่"
    await page.getByRole('button', { name: 'บันทึกรหัสผ่านใหม่', exact: true }).click();

    await expect(page.getByText(/รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน/i).or(page.getByText(/รหัสผ่านใหม่ไม่ตรงกัน/i))).toBeVisible();
  });
});
