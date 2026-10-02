# Workflow: Test Case Extraction, Spec Alignment & Session Reuse Guidelines

ทุกครั้งที่ผู้ใช้งานสั่งให้สกัด (extract) หรือปรับแก้ไข Test Case จากเอกสารกลาง ให้ปฏิบัติตามกฎและ Workflow ต่อไปนี้โดยอัตโนมัติ:

---

## 🎯 1. กฎเหล็ก: ยึด Test Step และ Expected Result ตามสเปกเป็นหลักสูงสุด (Strict Spec Compliance)
- **ความถูกต้องตามสเปกสำคัญกว่าผลลัพธ์การรัน (Spec Accuracy > Forced Passing):**
  - สคริปต์ Playwright ต้องเรียงขั้นตอนตาม **Test Step (ข้อ 1, 2, 3...)** และตรวจสอบผลตาม **Expected Result** ในเอกสารสเปก 100%
  - **ไม่จำเป็นต้องดัดแปลงโค้ดหรือตัดทอนการตรวจเช็กเพียงเพื่อให้ผลเทสออกมาเป็น `Passed`** หากระบบหน้าเว็บจริงมีพฤติกรรมขัดแย้งหรือแตกต่างจากสเปก ให้เขียนสคริปต์และ Assertion ยึดตามสเปกและรายงานข้อเท็จจริงต่อผู้ใช้งาน
- **การแจ้งเตือนข้อความแปลกๆ ใน Test Step (Anomalous Step Reporting):**
  - หากพบข้อความผิดปกติหรือการ Copy-Paste ผิดในเอกสาร (เช่น พูดถึง "สังเกตตัวเลขที่แสดงในช่อง" ในเคสตรวจรูปแบบอีเมล) ให้รายงานข้อสังเกตและแจ้งผู้ใช้งานทราบทันที

---

## 🔒 2. การจัดการ Session และการป้องกัน Rate Limit (`loginWithSession`)
- เพื่อป้องกันปัญหาหน้าเว็บขึ้นแจ้งเตือน **`คำขอมากเกินไป` (Rate Limit)** ให้ใช้การจัดการ Session จาก [`testcases/helpers/auth.ts`](file:///c:/Users/User/Documents/STS/testcase_scrap/testcases/helpers/auth.ts):
  - ใช้ฟังก์ชัน `loginWithSession(page, user, pass)` แทนการยิงล็อกอินใหม่ทุกครั้ง
  - ระบบจะดึง Session เดิมจากโฟลเดอร์ `.auth/<username>.json` มาใช้ซ้ำอัตโนมัติเมื่อยังมีผลอยู่
- **ห้ามสั่งรัน Playwright อัตโนมัติหลังเขียนโค้ดเสร็จ (No Automatic Playwright Run):**
  - เมื่อทำการแก้ไขหรืออัปเดตไฟล์ `.spec.ts` เสร็จเรียบร้อยแล้ว **ห้ามสั่งรัน Playwright test โดยอัตโนมัติเด็ดขาด** ให้สรุปรายการสคริปต์และคำสั่งทดสอบแจ้งต่อผู้ใช้งาน เพื่อให้ผู้ใช้งานเป็นผู้สั่งรันทดสอบเองตามต้องการ

---

## 📋 3. ขั้นตอนการทำงานประจำ (4-Step Standard Workflow)

1. **Extract ข้อมูลจากเอกสารกลาง:**
   - สกัด Test Case ID, Description, Test Step (1, 2, 3...), Expected Result, Test Data
   - สำรองข้อมูลลง JSON (`extracted_testcases.json`) และ CSV (`extracted_testcases.csv`)
2. **Update Markdown Documentation (`.md`):**
   - อัปเดตไฟล์ `testcases/FN-STS-XX_<ชื่อฟังก์ชัน>/FN-STS-XX_<ชื่อฟังก์ชัน>.md` ให้ข้อมูลและขั้นตอนตรงตามที่ extract มา 100%
3. **Align Playwright Automated Spec Files (`.spec.ts`):**
   - อัปเดตไฟล์ `TS-STS-XX-01.spec.ts`, `TS-STS-XX-02.spec.ts`, `TS-STS-XX-03.spec.ts`
   - เขียนโค้ดตาม **Test Step ทีละขั้นตอน (Literal Step-by-Step Execution)** รวมถึงการกดปุ่มยืนยัน/บันทึก
   - เรียกใช้ `loginWithSession` เพื่อดึง Session เดิมและไม่ยิงล็อกอินซ้ำ
   - ตัดการย้ายหน้าไปยัง `/profile` ที่ไม่จำเป็นออก เพื่อให้เริ่มต้นจากหน้าหลัง Login ทันที
4. **สรุปและรายงานผู้ใช้งาน (User Reporting):**
   - รายงานสรุปการปรับปรุงโค้ดและรายการ Test Cases ให้ผู้ใช้งานทราบ โดยไม่ต้องสั่งรัน Playwright อัตโนมัติ
