# DevTeam Framework 2 Documentation

<p align="center">
  <strong>เฟรมเวิร์กสำหรับพัฒนาเว็บแอปพลิเคชันด้วย Node.js + Express + EJS</strong><br>
  ออกแบบมาเพื่อรองรับการพัฒนาแบบ <strong>Single Port</strong> รวม Frontend และ Backend ไว้ในเซิร์ฟเวอร์เดียว
</p>

---

## 📋 สารบัญ

- [แนวคิดและที่มา](#-แนวคิดและที่มา)
- [เทคโนโลยี](#-เทคโนโลยี)
- [คุณสมบัติหลัก](#-คุณสมบัติหลัก)
- [ความต้องการของระบบ](#-ความต้องการของระบบ)
- [การติดตั้ง](#-การติดตั้ง)
- [การตั้งค่า Environment](#-การตั้งค่า-environment)
- [การรันโปรเจกต์](#-การรันโปรเจกต์)
- [โครงสร้างโปรเจกต์](#-โครงสร้างโปรเจกต์)
- [สถาปัตยกรรม](#-สถาปัตยกรรม)
- [หลักการเขียนโค้ด](#-หลักการเขียนโค้ด)
- [การเพิ่มหน้าใหม่](#-การเพิ่มหน้าใหม่)
- [สคริปต์ที่ใช้บ่อย](#-สคริปต์ที่ใช้บ่อย)
- [เอกสารอ้างอิง](#-เอกสารอ้างอิง)

---

## 💡 แนวคิดและที่มา

### ปัญหาของการพัฒนาเว็บสมัยใหม่

การพัฒนาเว็บในปัจจุบันมักมีความซับซ้อนมากเกินความจำเป็น โดยเฉพาะกับโปรเจกต์ขนาดเล็กถึงกลาง:

- **ต้องแยก Port** ระหว่าง Frontend และ Backend
- **ต้องตั้งค่า Proxy** และจดจำ Absolute Path
- **ใช้ทรัพยากรเครื่องสูง** เกินความจำเป็น
- ไม่เหมาะกับเว็บแบบ Multi-page ที่ไม่จำเป็นต้องใช้ SPA

### ปัญหาของ EJS แบบดั้งเดิม

การใช้ EJS แบบดั้งเดิมก็มีข้อจำกัดที่ทำให้พัฒนาได้ยาก:

- ต้อง **include layout ซ้ำ** ในทุกหน้า
- โครงสร้างไฟล์ **ขยายยาก**
- ไม่มีระบบจัดการ route/controller/service ที่ชัดเจน

### ทำไมต้อง DevTeam Framework 2?

DevTeam Framework 2 ถูกพัฒนาขึ้นเพื่อแก้ไขปัญหาเหล่านี้ โดยเน้น:

- **ความเรียบง่าย** — Single Port, ไม่ต้องตั้งค่า Proxy ซับซ้อน
- **Developer Experience ที่ดี** — Live Reload, โครงสร้างไฟล์เข้าใจง่าย
- **โครงสร้างที่ชัดเจน** — แยก View / Route / Controller / Service / Data อย่างเป็นระบบ
- **รองรับการ Migration** — ออกแบบมาโดยเฉพาะสำหรับงาน **ย้ายจาก PHP มา Node.js** โดยรักษาหน้าตาเว็บไซต์ให้เหมือนเดิมที่สุด
- **ไม่ใช้ SSR ใน EJS** — EJS ทำหน้าที่เป็น Static HTML Template เท่านั้น ข้อมูล dynamic โหลดผ่าน API ทาง client-side

---

## 🛠 เทคโนโลยี

| ชั้น | เทคโนโลยี |
|------|-----------|
| Runtime | Node.js 18+ |
| Web Framework | Express.js 5.x |
| Template Engine | EJS 4.x + express-ejs-layouts |
| Database | MySQL / MariaDB ผ่าน mysql2 (promise) |
| Authentication | JWT (jsonwebtoken) + Cookie |
| Dev Tools | Nodemon + LiveReload |

---

## ✨ คุณสมบัติหลัก

- ⚡ **Single Port** — รวม Frontend และ Backend ไว้ที่ Port เดียวกัน
- 🎨 **EJS Layouts** — รองรับ Layout และ Partial ส่วนกลาง
- 📁 **Relative Path** — อ้างอิงไฟล์แบบ Relative Path ทั้งหมด
- 🔄 **Live Reload** — รีเฟรชหน้าเว็บอัตโนมัติขณะพัฒนา
- 🔐 **JWT Middleware** — รองรับการยืนยันตัวตนและสิทธิ์ผู้ใช้
- 🗄 **MySQL2 Promise** — Query ฐานข้อมูลด้วย Prepared Statements
- 📱 **Multi-page Application** — เหมาะสำหรับเว็บแบบหลายหน้า
- 🧩 **โครงสร้างชัดเจน** — แยก View / Route / Controller / Service / Data ชัดเจน

---

## 📦 ความต้องการของระบบ

- [Node.js](https://nodejs.org/) เวอร์ชัน 18 ขึ้นไป
- [npm](https://www.npmjs.com/) หรือ [yarn](https://yarnpkg.com/)
- MySQL หรือ MariaDB

ตรวจสอบเวอร์ชัน Node.js ด้วยคำสั่ง:

```bash
node -v
```

---

## 🚀 การติดตั้ง

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/rungrotlnwza/DevTeam-EJS-FrameWork.git
cd DevTeam-EJS-FrameWork
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment

คัดลอกไฟล์ `example.env` แล้วเปลี่ยนชื่อเป็น `.env`:

```bash
cp example.env .env
```

จากนั้นแก้ไขค่าต่าง ๆ ใน `.env` ตามสภาพแวดล้อม

---

## ⚙ การตั้งค่า Environment

ไฟล์ `.env` ใช้กำหนดพฤติกรรมของระบบ

| ตัวแปร | คำอธิบาย | ค่าเริ่มต้น |
|--------|----------|-------------|
| `PORT` | พอร์ตสำหรับรันเซิร์ฟเวอร์ | `3000` |
| `LIVERELOAD` | เปิด/ปิด Live Reload | `true` |
| `DB_HOST` | โฮสต์ MySQL/MariaDB | `localhost` |
| `DB_USER` | ชื่อผู้ใช้ฐานข้อมูล | `root` |
| `DB_PASSWORD` | รหัสผ่านฐานข้อมูล | *(ว่าง)* |
| `DB_NAME` | ชื่อฐานข้อมูล | `mydb` |
| `JWT_SECRET` | คีย์ลับสำหรับลงนาม JWT | *(ต้องตั้งค่า)* |

> ⚠️ **คำเตือน:** อย่าลืมตั้งค่า `JWT_SECRET` ให้แข็งแรงและเก็บเป็นความลับใน Production

---

## ▶ การรันโปรเจกต์

### โหมดพัฒนา (Development)

```bash
npm run dev
```

เซิร์ฟเวอร์จะรันที่:

```
http://localhost:3000
```

Live Reload จะทำงานอัตโนมัติเมื่อ `LIVERELOAD=true`

### โหมด Production

```bash
node index.js
```

หรือใช้ Process Manager เช่น [PM2](https://pm2.keymetrics.io/):

```bash
pm2 start index.js --name devteam-framework
```

---

## 🗂 โครงสร้างโปรเจกต์

```text
DevTeam-EJS-FrameWork/
├─ app/
│  ├─ config/
│  │  └─ mysqli.config.js         # MySQL connection pool
│  ├─ controller/
│  │  ├─ auth.controller.js       # Authentication controller
│  │  ├─ eol/                     # EOL frontend controllers
│  │  └─ api/                     # API controllers
│  ├─ middleware/
│  │  └─ jwt.middleware.js        # JWT verification & role checking
│  ├─ model/                      # Data access layer (models)
│  │  ├─ eol/
│  │  └─ *.model.js
│  ├─ routes/
│  │  ├─ router.js                # Central router
│  │  ├─ frontend/                # Frontend routes
│  │  └─ api/                     # API routes
│  └─ service/                    # Business logic layer
│     └─ eol/
├─ assets/                        # Static files (CSS, JS, images)
├─ docs/
│  └─ framework/                  # Framework documentation
├─ tools/
│  └─ live_server.js              # LiveReload server
├─ views/
│  ├─ layouts/                    # EJS layouts
│  ├─ partials/                   # Reusable partials
│  └─ page/                       # Page views
├─ example.env                    # Environment template
├─ index.js                       # Application entry point
├─ package.json
└─ README.md
```

---

## 🏛 สถาปัตยกรรม

Framework นี้แบ่งชั้นการทำงานออกเป็น 5 ส่วนหลัก:

```
┌─────────────────────────────────────┐
│  View (EJS)                         │  Static HTML Template
├─────────────────────────────────────┤
│  Frontend Route / Controller        │  Render view จาก GET request
├─────────────────────────────────────┤
│  API Route / Controller             │  รับ POST/PUT/DELETE แล้ว return JSON
├─────────────────────────────────────┤
│  Service                            │  Validation + Business Logic
├─────────────────────────────────────┤
│  Data Layer                         │  SQL Queries ผ่าน mysql2
└─────────────────────────────────────┘
```

### กฎสำคัญ

- **View (EJS)** เป็น Static HTML template อย่างเดียว ห้าม SSR หรือประมวลผล POST
- **Frontend Route** รับ GET แล้ว render view เท่านั้น
- **API Route** return JSON เสมอ
- **Service** รับผิดชอบ validation และ business logic
- **Data Layer** รับผิดชอบ query database โดยตรง

ดูรายละเอียดเพิ่มเติมได้ที่ [Architecture Guide](ARCHITECTURE.md)

---

## 📝 หลักการเขียนโค้ด

### Module System

ใช้ **CommonJS** ทั้งโปรเจกต์:

```javascript
const someService = require('../service/some.service');

module.exports = {
  actionName: async (req, res) => {
    // implementation
  }
};
```

### การตั้งชื่อไฟล์

| ประเภท | รูปแบบ |
|--------|--------|
| Route | `*.routes.js` |
| Controller | `*.controller.js` |
| Service | `*.service.js` |
| Data Access | `*.model.js` |
| Middleware | `*.middleware.js` |
| View Layout | `*.layout.ejs` |
| View Page | `*.ejs` |
| Client JS | `assets/js/pages/<feature>/*.js` |

### Controller Pattern

```javascript
module.exports = {
  actionName: async (req, res) => {
    try {
      const result = await someService.action(req.body);
      if (!result.ok) {
        res.status(400).json({ message: result.message });
        return;
      }
      res.status(200).json(result.data);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
      return;
    }
  }
};
```

### Service Pattern

```javascript
module.exports = {
  actionName: async (body) => {
    if (!body.requiredField) {
      return {
        ok: false,
        code: 'MISSING_FIELD',
        message: 'กรุณากรอกข้อมูล'
      };
    }

    // business logic...

    return {
      ok: true,
      data: { /* response data */ }
    };
  }
};
```

### Client-Side Fetch Pattern

```javascript
fetch('/api/endpoint', {
  credentials: 'include',
  method: 'POST',
  body: new URLSearchParams(new FormData(form))
})
  .then(res => res.json())
  .then(data => {
    document.getElementById('msg').textContent = data.message;
  });
```

**ข้อห้าม:**
- ❌ ห้ามใช้ `.catch()` กับ fetch
- ❌ ห้ามใช้ `async/await` กับ fetch
- ❌ ห้ามสร้างฟังก์ชัน render แยก
- ❌ ห้ามใช้ helper function ครอบ fetch
- ❌ ห้าม SSR ใน EJS view

ดูรายละเอียดเพิ่มเติมได้ที่ [Coding Rules](CONTRIBUTING.md)

---

## ➕ การเพิ่มหน้าใหม่

1. **สร้าง View** ที่ `views/page/<feature>/<page>.ejs`
2. **สร้าง Frontend Route** ที่ `app/routes/frontend/<feature>/<feature>.routes.js`
3. **สร้าง Controller** (ถ้าจำเป็น) ที่ `app/controller/<feature>.controller.js`
4. **สร้าง Service** (ถ้ามี business logic) ที่ `app/service/<feature>.service.js`
5. **สร้าง Data Layer** (ถ้ามี database query) ที่ `app/model/<feature>.model.js`
6. **สร้าง API Route** (ถ้ามี POST/PUT/DELETE) ที่ `app/routes/api/<feature>/<feature>.routes.js`
7. **เพิ่ม Client JS** (ถ้ามี) ที่ `assets/js/pages/<feature>/<page>.js`
8. **ลงทะเบียน Route** ใน `app/routes/router.js`

---

## 🧰 สคริปต์ที่ใช้บ่อย

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `npm install` | ติดตั้ง dependencies |
| `npm run dev` | รันโหมดพัฒนาพร้อม Live Reload |
| `node index.js` | รันโหมด Production |
| `npm run update` | ดึงอัปเดตล่าสุดจาก remote `framework` |

---

## 📚 เอกสารอ้างอิง

- [Architecture Guide](ARCHITECTURE.md) — สถาปัตยกรรมและโครงสร้างโปรเจกต์
- [Coding Rules](CONTRIBUTING.md) — กฎและรูปแบบการเขียนโค้ด
- [Environment Variables](ENVIRONMENT.md) — ตัวแปรแวดล้อมและการตั้งค่า
- [Routing Concept](ROUTING.md) — แนวคิดการจัดการเส้นทาง
- [Database](DATABASE.md) — การเชื่อมต่อและ query ฐานข้อมูล
- [JWT Middleware](JWT-MIDDLEWARE.md) — ระบบยืนยันตัวตนและสิทธิ์ผู้ใช้
- [Setup Guide](SETUP.md) — การตั้งค่าระบบสำหรับ update framework

---

<p align="center">
  พัฒนาโดย <strong>DevTeam</strong>
</p>
