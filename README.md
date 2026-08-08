# EOL Website Migration — PHP to Node.js

<p align="center">
  <strong>โปรเจกต์ย้ายเว็บไซต์จาก PHP มาเป็น Node.js โดยใช้ DevTeam Framework 2</strong><br>
  รักษาหน้าตาและประสบการณ์ผู้ใช้ให้เหมือนเดิม 100%
</p>

---

## 📋 สารบัญ

- [ภาพรวมโปรเจกต์](#-ภาพรวมโปรเจกต์)
- [เป้าหมาย](#-เป้าหมาย)
- [ขอบเขตงาน](#-ขอบเขตงาน)
- [เทคโนโลยี](#-เทคโนโลยี)
- [โครงสร้างโปรเจกต์](#-โครงสร้างโปรเจกต์)
- [ข้อตกลงสำคัญ](#-ข้อตกลงสำคัญ)
- [เริ่มต้นพัฒนา](#-เริ่มต้นพัฒนา)
- [สถานะความคืบหน้า](#-สถานะความคืบหน้า)
- [บัญชีทดสอบ](#-บัญชีทดสอบ)
- [เอกสารอ้างอิง](#-เอกสารอ้างอิง)

---

## 🎯 ภาพรวมโปรเจกต์

โปรเจกต์นี้เป็นงาน **Migration** ย้ายเว็บไซต์ของลูกค้าจาก **PHP** มาเป็น **Node.js** โดยใช้ **DevTeam Framework 2** เป็นเฟรมเวิร์กหลัก

ลูกค้ามีหน้าเว็บและ source code PHP อยู่แล้ว งานของเราคือนำระบบทั้งหมดมาพัฒนาใหม่บน Node.js โดยไม่เปลี่ยนแปลงรูปแบบการแสดงผล หรือประสบการณ์การใช้งานของผู้ใช้ปลายทาง

---

## 🚀 เป้าหมาย

- ✅ ย้ายระบบทั้งหมดจาก PHP มา Node.js
- ✅ รักษา **UI/UX** และหน้าตาเว็บไซต์ให้เหมือนเดิม
- ✅ ย้าย **ทุก Modules** และ **Assets Path** ตามที่ลูกค้าต้องการ
- ✅ ใช้ **Code Framework และ Coding Style ของทีม DevTeam**
- ✅ ใช้ฐานข้อมูลเดิมของลูกค้า (`engtest_online`)
- ✅ ไม่ลบไฟล์ PHP เดิมออก ย้ายทีละหน้า / ทีละฟีเจอร์

---

## 📦 ขอบเขตงาน

### ใน Scope

- ย้ายหน้าเว็บทั้งหมดจาก PHP มา Node.js/EJS
- ย้ายระบบ Authentication (Login / Register / Forgot Password)
- ย้ายระบบ EOL System (Refill, Profile, Password, Master Account)
- ย้ายหน้า Forum, Topic, Shop, Certificate, Info, Contact
- ย้าย Static Assets ทั้งหมด (CSS, JS, Images, Fonts)
- ปรับ URL Mapping ให้ใกล้เคียง PHP เดิมมากที่สุด

### นอก Scope

- ออกแบบ UI ใหม่
- เปลี่ยนฐานข้อมูล
- ลบไฟล์ PHP เดิมทิ้ง

---

## 🛠 เทคโนโลยี

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | DevTeam Framework 2 |
| Runtime | Node.js 18+ |
| Web Framework | Express.js 5.x |
| Template Engine | EJS 4.x + express-ejs-layouts |
| Database | MySQL / MariaDB (`engtest_online`) |
| Authentication | JWT + httpOnly Cookie |
| Client-Side | Vanilla JavaScript + Fetch API |
| Dev Tools | Nodemon + LiveReload |

---

## 🗂 โครงสร้างโปรเจกต์

```text
public_html/
├─ A0-DevTeam-EJS-FrameWork/      # Framework + งาน migration ปัจจุบัน
│  ├─ app/                        # Routes, Controllers, Services, Data
│  ├─ assets/                     # Static assets สำหรับงาน migration
│  ├─ views/                      # EJS views
│  ├─ docs/framework/             # เอกสาร framework
│  ├─ index.js                    # Entry point
│  └─ README.md                   # เอกสารนี้
├─ EOL/                           # Source PHP เดิม (ไม่ลบ)
├─ 2010/                          # Assets / รูปภาพ PHP เดิม
├─ assets/                        # Assets อื่น ๆ ของระบบเดิม
├─ css/                           # CSS ของระบบเดิม
├─ js/                            # JS ของระบบเดิม
└─ ...                            # ไฟล์ PHP และ assets อื่น ๆ
```

---

## ⚠️ ข้อตกลงสำคัญ

### 1. ห้ามเปลี่ยนรูปแบบการแสดงผล

ทุกหน้าที่ย้ายต้องมีหน้าตาเหมือน PHP เดิมเป๊ะ ตั้งแต่ layout, สี, ฟอนต์, ระยะห่าง, จนถึงพฤติกรรมของ interactive elements

### 2. ไม่ใช้ SSR ใน EJS

- EJS view เป็น **Static HTML Template** เท่านั้น
- ห้ามใช้ `<%= %>`, `<% if %>`, `<% for %>` เพื่อ render ข้อมูลจาก server
- ข้อมูล dynamic ทั้งหมดต้องโหลดผ่าน **API + Client-Side JavaScript**

### 3. ใช้ Coding Style ของทีม

- CommonJS (`require` / `module.exports`)
- แยกชั้น View / Route / Controller / Service / Data
- Client-side ใช้ `fetch()` + `credentials: 'include'` + Promise chain
- ไม่ใช้ `async/await` กับ `fetch()` ใน client-side

### 4. Authentication

- ใช้ **JWT Token** ที่เก็บใน **httpOnly Cookie**
- Middleware ตรวจสอบสิทธิ์ที่ router ของแต่ละหน้า
- API ต้องส่ง `credentials: 'include'` เสมอ

---

## 🏁 เริ่มต้นพัฒนา

### 1. เข้าไปที่โฟลเดอร์ Framework

```bash
cd A0-DevTeam-EJS-FrameWork
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment

```bash
cp example.env .env
```

แก้ไขค่าใน `.env` ให้ตรงกับสภาพแวดล้อมและฐานข้อมูลของลูกค้า

### 4. รันโปรเจกต์

```bash
npm run dev
```

เซิร์ฟเวอร์จะรันที่ `http://localhost:3000`

---

## 🧪 บัญชีทดสอบ

ใช้สำหรับทดสอบหน้า `/EOL/eoltest` และฟีเจอร์อื่น ๆ ของระบบ รองรับทั้ง `http://localhost:3000` และ `http://localhost:80`

| ประเภท | Username | Password | ชื่อ | สิทธิ์ | สถานะ | หมายเหตุ |
|---|---|---|---|---|---|---|
| บุคคลทั่วไป | `rrmctgk1` | `rrmctgk1` | รุ่งโรจน์ เมืองเฉลิม | Member | Active | มีเวลาใช้งานจนถึงประมาณ 2026-07-01 |
| บัญชี Corporate (Sub) | `rrmctgk2` | `rrmctgk2` | Test Sub | Corporate Member | Active | สังกัด Master `rrmctgk3` ระบบจะเติมเวลาให้อัตโนมัติจาก master |
| บัญชี Master (Corporate) | `rrmctgk3` | `rrmctgk3` | Test Master | Master | Active | มีจำนวนวัน 1,000,000 วัน ใช้จัดการ sub account |
| บุคคลทั่วไป | `rrmctgk4` | `rrmctgk4` | Test4 Last4 | Member | Active | บัญชีส่วนตัวสำหรับทดสอบ localhost:3000 / localhost:80 |
| บัญชี Corporate (Sub) | `rrmctgk5` | `rrmctgk5` | Test5 Last5 | Corporate Member | Active | สังกัด Master `rrmctgk6` ใช้ทดสอบ sub-account |
| บัญชี Master (Corporate) | `rrmctgk6` | `rrmctgk6` | Test6 Last6 | Master | Active | บัญชี Master สำหรับทดสอบการจัดการ sub-account |

> หมายเหตุ: บัญชีเหล่านี้เป็นข้อมูลจริงในฐานข้อมูล `engtest_online` ใช้เฉพาะการทดสอบเท่านั้น ห้ามลบหรือแก้ไขข้อมูลสำคัญ

### บัญชี Backoffice Admin

ใช้สำหรับทดสอบหน้า `/backoffice/mainoffice/admin` (Academician) และ `/backoffice/mainoffice/office` (Webmaster)

| Section | Table | Username | Password | admin_id | สถานะ |
|---|---|---|---|---|---|
| Office | `tbl_web_admin` | `rungrot` | `muangchalerm` | 114 | Active |
| Admin | `tbl_admin` | `rungrot` | `Muangchalerm` | 14 | Active |

> ⚠️ หมายเหตุ: ข้อมูลนี้เป็นรหัสผ่านจริงสำหรับการทดสอบ ห้ามแชร์หรือ commit ขึ้น public repository

### บัญชี 1 Year Course

ใช้สำหรับทดสอบหน้า `/1yearcourse.php` และระบบบทเรียน 52 สัปดาห์ (`1yc/*.php`)

| ประเภท | Table | Username | Password | ชื่อ | สถานะ |
|---|---|---|---|---|---|
| 1 Year Course | `tbl_x_member_1year` | `rrmctgk1yc` | `rrmctgk1yc` | Test 1Year | Active (1 ปี + 4 สัปดาห์) |

> หมายเหตุ: บัญชี 1 year ใช้ session `x_member_1year` แยกจากระบบ EOL ปกติ ถ้ายังไม่มีข้อมูลในฐานข้อมูล ให้ insert เข้า `tbl_x_member_1year` ก่อนใช้ทดสอบ

### หมายเหตุ: หน้า SYSTEM PAGE ว่างสำหรับบัญชีทดสอบบางบัญชี

บัญชี **Personal / Corporate Sub** อาจ login แล้วเข้าหน้า `/EOL/eoltest.php?section=business` แล้วเจอ **SYSTEM PAGE ว่าง** (มีแท็บแต่ไม่มีเนื้อหา) เนื่องจากใน `EOL/eoloption.php` ฟังก์ชัน `check_time_member()` คืนค่าเป็นจำนวนแถว active time จาก `tbl_x_member_time` แล้วโค้ดตรวจแค่ `== 0` กับ `== 1` ถ้าบัญชีมี active row มากกว่า 1 แถว จะไม่ render เนื้อหา

**Workaround ฉุกเฉิน (แก้ผ่านข้อมูล ไม่ต้องแก้โค้ด):**

1. สร้างไฟล์ `EOL/merge_time.php` แล้วใส่โค้ดด้านล่าง
2. เปิด `http://localhost/EOL/merge_time.php` เพื่อ merge active rows ที่ซ้ำ
3. ลบไฟล์ `merge_time.php` ออกหลังใช้งานเสร็จ

```php
<?php
include('../config/connection.php');
date_default_timezone_set('Asia/Bangkok');
$users = ['rrmctgk1','rrmctgk2','rrmctgk4','rrmctgk5'];
$now = date('Y-m-d H:i:s');
foreach ($users as $u) {
    $stmt = $conn->prepare("SELECT member_id FROM tbl_x_member WHERE user=?");
    $stmt->bind_param('s', $u);
    $stmt->execute();
    $mid = $stmt->get_result()->fetch_array()['member_id'];
    $stmt->close();
    if (!$mid) continue;

    $stmt = $conn->prepare("SELECT refill_id, start, stop FROM tbl_x_member_time WHERE member_id=? AND start<=? AND stop>=? ORDER BY start ASC");
    $stmt->bind_param('sss', $mid, $now, $now);
    $stmt->execute();
    $res = $stmt->get_result();
    $active = [];
    while ($r = $res->fetch_assoc()) $active[] = $r;
    $stmt->close();

    if (count($active) <= 1) continue;

    $keeper = $active[0];
    $min_start = $keeper['start'];
    $max_stop = $keeper['stop'];
    $ids = [];
    foreach ($active as $i => $r) {
        if ($r['start'] < $min_start) $min_start = $r['start'];
        if ($r['stop'] > $max_stop) $max_stop = $r['stop'];
        if ($i > 0) $ids[] = (int)$r['refill_id'];
    }

    $upd = $conn->prepare("UPDATE tbl_x_member_time SET start=?, stop=? WHERE refill_id=?");
    $upd->bind_param('ssi', $min_start, $max_stop, $keeper['refill_id']);
    $upd->execute();
    $upd->close();

    $conn->query("DELETE FROM tbl_x_member_time WHERE refill_id IN (" . implode(',', $ids) . ")");
}
echo "Done";
```

> ⚠️ วิธีนี้เป็นเพียง workaround ถ้าระบบสร้าง active row ซ้ำอีก ปัญหาจะกลับมา การแก้ถาวรคือปรับ `EOL/eoloption.php` ให้รองรับ `$usable >= 1` แทน `$usable == 1`

---

## 📊 สถานะความคืบหน้า

| ฟีเจอร์ | สถานะ | หมายเหตุ |
|---------|--------|----------|
| Home Page (`index.ejs`) | ✅ เสร็จสิ้น | ใช้ CSR ผ่าน `assets/js/pages/index.js` |
| Authentication (Register/Forgot) | ✅ เสร็จสิ้น | JWT + httpOnly Cookie |
| EOL eoltest System | ✅ เสร็จสิ้น | Refill, Profile, Password, Master, Academic, Report, Statistics |
| EOL Standard Test | ✅ เสร็จสิ้น | `/EOL/standardtest` |
| EOL Contest | ✅ เสร็จสิ้น | `/EOL/eolcontest` |
| Corporate (ecop) | ✅ เสร็จสิ้น | `/corporate/ecop` |
| Lessons / eLearning | ✅ เสร็จสิ้น | `/lessons` |
| Forum | ✅ เสร็จสิ้น | `/forum/detail`, `/forum/e-eng`, `/forum/other` |
| Certificate | ✅ เสร็จสิ้น | `/certificate` |
| Shop | ✅ เสร็จสิ้น | หน้าสินค้าหลัก (static) — ยังไม่ได้เชื่อมต่อ `/api/product` กับหน้า |
| Exam List | ✅ เสร็จสิ้น | หน้ารายการสอบหลัก |
| Info Pages | ✅ เสร็จสิ้น | about, privacy, safe, stop, whatiseol |
| Master Corporate Main Page | ✅ เสร็จสิ้น | ตรวจสอบ `corporate_main()` ใน `EOL/eoloption.php` บรรทัด 475–1393 แล้ว ครบถ้วน |
| Sub-corporate / usable check | ✅ เสร็จสิ้น | ตรวจสอบ `sub_coporate()` และ `account.usable` แล้ว ตรงกับ PHP (และแก้ bug หลาย active row) |
| 1 Year Course (`/1yc/*`) | ✅ เสร็จสิ้น | Lessons, Content, FAQ, Logtime / ใช้ข้อมูล 52 สัปดาห์จาก `1yc/fn_1yc.php` |
| SSR Refactor / Testing | ⏳ รอดำเนินการ | ลบ SSR ที่เหลือ (forum filter, shop loop) และทดสอบทุก flow |

> หมายเหตุ: อัปเดตล่าสุดตาม commit `8e34557` และโครงสร้างไฟล์ปัจจุบัน

---

## 📚 เอกสารอ้างอิง

- [DevTeam Framework 2 Documentation](docs/framework/README.md) — เอกสารหลักของ framework
- [Architecture Guide](docs/framework/ARCHITECTURE.md) — สถาปัตยกรรมและโครงสร้าง
- [Coding Rules](docs/framework/CONTRIBUTING.md) — กฎการเขียนโค้ด
- [Environment Variables](docs/framework/ENVIRONMENT.md) — การตั้งค่า Environment
- [Database](docs/framework/DATABASE.md) — การเชื่อมต่อฐานข้อมูล
- [JWT Middleware](docs/framework/JWT-MIDDLEWARE.md) — ระบบยืนยันตัวตน

---

## 👥 ทีมพัฒนา

พัฒนาโดย **DevTeam**

---

<p align="center">
  <strong>Migration ด้วยความระมัดระวัง — รักษาประสบการณ์ผู้ใช้ไว้เหมือนเดิม</strong>
</p>
