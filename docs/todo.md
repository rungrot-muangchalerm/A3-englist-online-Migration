# TODO: สำหรับหน้า EOL System (eoltest)

> ไฟล์นี้สรุปงานที่ยังต้องทำสำหรับหน้า `/EOL/eoltest` (`views/page/eol/eoltest.ejs`) หลังจากเปรียบเทียบกับต้นฉบับ `EOL/eoloption.php` (5,114 บรรทัด)

---

## สถานะปัจจุบัน

- ไฟล์ `views/page/eol/eoltest.ejs` มี 1,042 บรรทัด (ปัจจุบันแยกเป็นไฟล์ย่อยแล้ว — `index.ejs`, `profile.ejs`, `refill.ejs`, `master.ejs`, `academic.ejs`, `statistics.ejs`, `etest.ejs` และ `report/*.ejs`)
- ไม่มี `app/controller/eol/business.controller.js` แล้ว (ลบออกแล้ว ทุก mutation ใช้ API)
- Route: `/eol/eoltest`
- ทำ SSR หนักมาก ฝ่าฝืน CONTRIBUTING.md
- ชื่อไฟล์และ URL ไม่ตรงกับต้นฉบับ PHP (`/EOL/eoltest.php`)

## หน้าที่ทำงานได้แล้ว (Done)

- [x] `viewMode === 'personal'` — Dashboard บุคคลทั่วไป
- [x] `viewMode === 'expired'` — หน้า Account หมดอายุ
- [x] `viewMode === 'refill'` — ฟอร์มเติมเงิน + ประวัติการเติม
- [x] `viewMode === 'edit_profile'` — แก้ไข Profile + Password
- [x] `viewMode === 'master'` — จัดการ Group / Sub-member (พื้นฐาน)
- [x] `viewMode === 'coming_soon'` — Placeholder

---

## P0 — ฟีเจอร์หลักที่ยังขาด (Critical)

### 1. แก้ชื่อไฟล์และ URL ให้ตรงต้นฉบับ
- [x] เปลี่ยน `views/page/eol/business.ejs` เป็น `views/page/eol/eoltest.ejs`
- [x] เปลี่ยน route `/eol/business` เป็น `/EOL/eoltest`
- [x] อัปเดท link ในทุกที่ที่อ้างอิง `/eol/business` (menu, redirect, form action)
- [x] อัปเดท `script.js` (`system_menu.ejs` ไม่มีในโปรเจกต์นี้)

### 2. Report Section (`?action=report`)
- [x] หน้าเลือก report section (`report_select_section`)
  - Academic
  - Standard Test
  - Contest
- [x] ย้ายมาจาก `eoloption.php` function: `report_select_section()`

### 3. Academic Report (`?action=report&report_section=academic`)
- [x] หน้ารายการผลสอบ Academic (`report_a_layout` + `report_a_result_list`)
- [x] หน้ารายละเอียดผลสอบ Academic (`report_a_result_detail`)
- [x] รองรับ `skill_id` filter
- [x] รองรับ `result_id` สำหรับ detail view
- [x] ย้ายมาจาก `eoloption.php` functions:
  - `corporate_focus_profile()`
  - `user_focus_profile()`
  - `report_a_layout()`
  - `report_a_result_list()`
  - `report_a_result_detail()`

### 4. Standard Test Report (`?action=report&report_section=standard`)
- [x] หน้ารายการผลสอบ Standard Test (`report_stest_list`)
- [x] หน้ารายละเอียดผลสอบ Standard Test (`report_s_result_detail`)
- [x] ย้ายมาจาก `eoloption.php` functions:
  - `report_stest_list()`
  - `report_s_result_detail()`

### 5. Contest Report (`?action=report&report_section=contest`)
- [x] หน้ารายการผลสอบ Contest (`report_list_contest`)
- [x] หน้ารายละเอียดผลสอบ Contest (`report_contest_result_detail`)
- [x] ย้ายมาจาก `eoloption.php` functions:
  - `report_list_contest()`
  - `report_contest_result_detail()`

---

## P1 — ฟีเจอร์รองที่ยังขาด (Important)

### 6. Action: Academic (`?action=academic`)
- [x] ตรวจสอบว่า `action=academic` ใน PHP คือ flow ไหนกันแน่
  - คือการ include `evaluaton_test.php` ซึ่งเป็นหน้าเลือก Skill/Level สำหรับเข้าทดสอบ Evaluation Test
  - มี Single Skills (Reading, Listening, Semi-Speaking, Semi-Writing, Grammar, Vocabulary) และ Multiple Skills
  - ปลดล็อค level ถัดไปเมื่อผ่าน level ก่อนหน้า ≥ 50%
  - กด Test แล้ว redirect ไป `systemtest.php?action=set_test` (test engine ใหญ่ ยังไม่ทำใน item นี้)
- [x] สร้าง API `/api/eol/academic/status` สำหรับดึงสถานะปลดล็อค skill/level
- [x] เพิ่ม `viewMode === 'academic'` ใน `business.controller.js`
- [x] สร้าง static frame ใน `eoltest.ejs` สำหรับหน้าเลือก Skill/Level
- [x] สร้าง `assets/js/pages/eol/academic.js` โหลดสถานะและ render หน้า
- [x] จัดการ `sub_action=set_test` ให้ redirect ไปหน้าที่ยังไม่เปิดใช้งาน / placeholder สำหรับ test engine

> **หมายเหตุ:** `systemtest.php` (test engine) เป็นงานใหญ่แยก ไม่รวมใน P1 item นี้

### 7. Master Corporate Main Page
- [x] ตรวจสอบว่า `corporate_main()` ใน PHP ตรงกับ `viewMode === 'master'` ปัจจุบันหรือไม่ — **ครบถ้วนแล้ว**
- [x] เพิ่มส่วนที่ขาดถ้ามี — ไม่มีส่วนขาด ฟีเจอร์ master dashboard ใน Node.js ครอบคลุม action ทั้งหมดของ PHP
  > หมายเหตุ: ตรวจสอบกับ `EOL/eoloption.php` บรรทัด 475–1393 แล้ว

### 8. Sub-corporate / usable check
- [x] ตรวจสอบ logic `sub_coporate()` ใน `eoloption.php` — **ตรงกันแล้ว**
- [x] ตรวจสอบว่า `account.usable` และ `account.corporate` ใน `app/service/eol/account.service.js` คำนวณถูกต้องครบถ้วนหรือไม่ — **ถูกต้อง**
  > หมายเหตุ: Node.js ใช้ `hasActiveTime() > 0` แทน PHP `check_time_member() == 1` ซึ่งเป็นการแก้ bug ที่ README.md ระบุไว้ (หลาย active row ทำให้หน้าว่าง)

---

## P2 — Refactor ตาม CONTRIBUTING.md (Cleanup)

### 9. ลบ SSR ออกจากหน้า EOL eoltest
- [x] `<%= challenge.token %>` และ `<%= challenge.label %>` → โหลดผ่าน API `/api/eol/refill` แล้ว
- [x] `<%= profile.* %>` → โหลดผ่าน API `/api/eol/profile` แล้ว
- [x] `<%= refillHistory %>`, `<%= history %>` → โหลดผ่าน API `/api/eol/refill` แล้ว
- [x] `<%= groups %>`, `<%= subMembers %>` → โหลดผ่าน API `/api/eol/master` แล้ว
- [x] `<%= educationLevels %>` → โหลดผ่าน API `/api/eol/profile` แล้ว
- [x] `<%= avatarUrl %>`, `<%= avatarWidth %>`, `<%= hasAvatar %>` → โหลดผ่าน API `/api/eol/profile` แล้ว
- [ ] ลบ SSR ที่ยังเหลือในนอก EOL system:
  - `views/page/forum/e-eng.ejs:90` ใช้ `<% const activeClass = ... %>` สำหรับ CSS class
  - `views/page/shop/product-*.ejs` มี `<% products.forEach(...) %>` แต่ route ไม่ส่ง `products` เข้าไป

### 10. แยก View ออกจากกัน (ทำแล้ว)
- [x] แยกหน้า refill ออกมาเป็น `/eol/eoltest/refill`
- [x] แยกหน้า profile ออกมาเป็น `/eol/eoltest/edit_profile`
- [x] แยกหน้า master ออกมาเป็น `/eol/eoltest` (viewMode master)
- [x] แยกหน้า report ออกมาเป็น `/eol/eoltest/report/*`

### 11. เปลี่ยน Form Submit เป็น API (ทำแล้ว)
- [x] Refill form: POST `/api/eol/refill`
- [x] Profile form: POST `/api/eol/profile`
- [x] Password form: POST `/api/eol/password`
- [x] Master actions: เปลี่ยนเป็น API + client-side reload หมดแล้ว

### 12. แยก JavaScript ออกจาก EJS
- [x] เอา `<script>` หลักของ eoltest ไปไว้ใน `assets/js/pages/eol/eoltest.js` (และ `academic.js`, `master.js`, `report.js` ตามส่วน)
- [ ] ยังมี inline script บางส่วนใน `views/page/forum/e-eng.ejs` และ shop pages ที่ควรแยก/ลบ
- [ ] ลบ jQuery dependency ถ้าทำได้ หรือจัดการให้อยู่รวมกัน

---

## P3 — Testing & Polish

### 13. เทสต์ทุก flow
- [ ] Test แต่ละ viewMode กับ account แต่ละ type
- [ ] Test report section ทั้ง 3
- [ ] Test report detail ด้วย result_id
- [ ] Test master actions ทั้งหมด
- [ ] Test refill, profile, password
- [ ] Test กรณีไม่ login (ต้อง redirect)

### 14. อัปเดทเอกสาร
- [ ] อัปเดท `docs/framework/CONTRIBUTING.md` ถ้ามี exception เพิ่ม
- [ ] อัปเดท README หรือ AGENTS.md ถ้าจำเป็น

---

## P4 — Refactor: Static EJS + API (Progressive)

### Phase 1 — Header / Layout via API (DONE)
- [x] สร้าง API `GET /api/eol/account` สำหรับดึง `member` + `account` (type, corporate, usable, isAdmin, infoText)
- [x] แก้ `views/layouts/system.layout.ejs` ให้ header เป็น static placeholder (`#info_user`, `#system-menu`)
- [x] สร้าง `assets/js/layout/system.header.js` โหลด `/api/eol/account` แล้ว render header + menu tabs
- [x] ปรับ `business.controller.js` ให้ไม่ต้องส่ง `member`/`account` สำหรับ `action=report` และ `action=academic`
- [x] เอา jQuery + jQuery Tools ออกจาก `views/layouts/system.layout.ejs`
- [x] แปลง inline script สำหรับ master modal / `$.ajax` ใน `eoltest.ejs` เป็น vanilla JS + `fetch`
  - `rename()` / `edit_subAcc()` / `edit_subAcc_Call()`
  - modal overlay สำหรับ `prompt1` และ `prompt2`
- [x] ทดสอบ render ถูกต้องทั้งบัญชี personal / master / corporate
  - `rrmctgk1` personal → Profile + Refill + SYSTEM Page
  - `rrmctgk2` corporate sub → Profile + Refill + Multi-Learning + SYSTEM Page
  - `rrmctgk3` master → Profile + Statistics + Add Test & Lesson + SYSTEM Page

### Phase 2 — Simple Views via API (DONE)
- [x] `viewMode === 'personal'` / `expired` / `coming_soon`: ลบ SSR ที่ไม่จำเป็น
- [x] `viewMode === 'refill'`: โหลด `challenge`, `history`, `refillHistory` ผ่าน API `GET /api/eol/refill`
- [x] `viewMode === 'edit_profile'`: โหลด `profile`, `educationLevels`, `avatar` ผ่าน API `GET /api/eol/profile`

### Phase 3 — Master & Forms via API (DONE)
- [x] `viewMode === 'master'`: โหลด `groups`, `subMembers` ผ่าน API `GET /api/eol/master`
- [x] เปลี่ยน master actions ทั้งหมดเป็น `fetch` ผ่าน API:
  - `POST /api/eol/master/group/create`, `/rename`, `/delete`
  - `POST /api/eol/master/member/add`, `/edit`, `/status`, `/left`, `/delete`
  - `POST /api/eol/master/members/limit`, `/unlimit`, `/delete`, `/move`
- [x] `views/page/eol/eoltest.ejs` ไม่มี EJS syntax เหลือแล้ว (นอกจาก layout หลักที่ใช้ `<%- body %>`)
- [x] ลบ `POST /EOL/eoltest` ออกจาก frontend route + ลบ `business.controller.js` เพราะทุก mutation ใช้ `/api/eol/master/*` หมดแล้ว

> **หมายเหตุ:** `views/partials/system_menu.ejs` ลบออกแล้ว (SSR เดิม ไม่ถูกใช้งาน)

---

## หมายเหตุ

- งานนี้ใหญ่มาก ไม่ควรทำในครั้งเดียว ควรทีละ P0 item
- ควร commit ทีละฟีเจอร์เพื่อง่ายต่อการ rollback
- ถ้าจะ refactor ตาม CONTRIBUTING.md แนะนำให้ทำหลังจากย้ายฟีเจอร์ครบก่อน
- อัปเดตสถานะล่าสุด: P0 เสร็จสิ้นทั้งหมด, P4 Phase 1-3 เสร็จสิ้น, P1 เสร็จสิ้นทั้งหมด, P3 ยังรอดำเนินการ, P2 ทำไปบางส่วนแล้ว (SSR ใน EOL system ลบหมด, view/form/API แยกหมด, แต่ยังเหลือ SSR ใน forum/shop และ inline script บางส่วน)
