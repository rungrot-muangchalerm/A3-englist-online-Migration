# Architecture Guide — DevTeam Framework 2

เอกสารนี้อธิบายสถาปัตยกรรมของ **DevTeam Framework 2** รวมถึงโครงสร้างโปรเจกต์ หลักการแบ่งชั้นการทำงาน และแนวทางสำหรับการพัฒนาและย้ายหน้าจาก PHP มาเป็น Node/Express/EJS

---

## สารบัญ

- [หลักการหลัก](#หลักการหลัก)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [โครงสร้าง Layer](#โครงสร้าง-layer)
- [หน้าที่ของแต่ละ Layer](#หน้าที่ของแต่ละ-layer)
- [มาตรฐาน Endpoint](#มาตรฐาน-endpoint)
- [ข้อห้าม](#ข้อห้าม)
- [การเพิ่มหน้าใหม่](#การเพิ่มหน้าใหม่)

---

## หลักการหลัก

- **EJS view คือ Static HTML template เท่านั้น** — ไม่มี business logic, ไม่มี SSR, ไม่มีการตรวจสอบข้อมูล, ไม่มี redirect
- **Frontend JavaScript ใช้ `fetch()`** เรียก API endpoint เพื่อส่งข้อมูลและรับผลลัพธ์
- **API Controller/Route แยกจาก Frontend Route** อย่างชัดเจน
- **Service Layer** รับผิดชอบ validation + business logic
- **Data Layer** รับผิดชอบ SQL queries ผ่าน `mysql2/promise`

---

## โครงสร้างโปรเจกต์

```text
DevTeam-EJS-FrameWork/
├─ app/
│  ├─ config/
│  │  └─ mysqli.config.js         # MySQL connection pool (mysql2/promise)
│  ├─ controller/
│  │  ├─ auth.controller.js       # Authentication controller
│  │  ├─ contact.controller.js    # Contact page controller
│  │  ├─ eol/                     # EOL frontend controllers
│  │  │  └─ eoltest.controller.js
│  │  ├─ api/                     # API controllers
│  │  │  └─ eol/
│  │  │      └─ eol.api.controller.js
│  │  ├─ topic.controller.js
│  │  ├─ forum.controller.js
│  │  ├─ product.controller.js
│  │  ├─ certificate.controller.js
│  │  └─ teoc.controller.js
│  ├─ model/                      # Data access layer (models)
│  │  ├─ eol/                     # EOL models
│  │  │  ├─ etest.model.js
│  │  │  ├─ master.model.js
│  │  │  ├─ profile.model.js
│  │  │  ├─ refill.model.js
│  │  │  └─ statistics.model.js
│  │  ├─ topic.model.js
│  │  ├─ forum.model.js
│  │  ├─ product.model.js
│  │  ├─ certificate.model.js
│  │  ├─ other.model.js
│  │  └─ teoc.model.js
│  ├─ middleware/
│  │  └─ jwt.middleware.js        # JWT verification, authentication, role check
│  ├─ routes/
│  │  ├─ router.js                # Central router
│  │  ├─ frontend/                # Frontend routes
│  │  │  ├─ frontend.routes.js
│  │  │  ├─ eol/eol.routes.js
│  │  │  ├─ eol_system/eol_system.routes.js
│  │  │  ├─ contact/contact.routes.js
│  │  │  ├─ forum/forum.routes.js
│  │  │  ├─ shop/shop.routes.js
│  │  │  ├─ exam_list/exam_list.routes.js
│  │  │  └─ info/info.routes.js
│  │  └─ api/                     # API routes
│  │      ├─ api.routes.js
│  │      ├─ auth/auth.routes.js
│  │      ├─ eol/eol.api.routes.js
│  │      ├─ topic/topic.routes.js
│  │      ├─ forum/forum.routes.js
│  │      ├─ product/product.routes.js
│  │      ├─ certificate/certificate.routes.js
│  │      └─ teoc/teoc.routes.js
│  └─ service/                    # Business logic layer
│      └─ eol/
│          ├─ account.service.js
│          ├─ refill.service.js
│          ├─ profile.service.js
│          └─ master.service.js
├─ assets/                        # Static files (CSS, JS, images)
├─ docs/
│  └─ framework/                  # Framework documentation
├─ tools/
│  └─ live_server.js              # LiveReload server
├─ views/
│  ├─ layouts/
│  │  ├─ main.layout.ejs          # Main layout for public pages
│  │  └─ system.layout.ejs        # Layout for EOL system pages
│  ├─ partials/
│  │  ├─ header.ejs
│  │  └─ footer.ejs
│  └─ page/                       # Page views
│      ├─ index.ejs
│      ├─ auth/register_account.ejs
│      ├─ auth/forgot.ejs
│      ├─ contact/contact.ejs
│      ├─ certificate.ejs
│      ├─ eol/eoltest/*.ejs
│      ├─ eol_system/*.ejs
│      ├─ forum/*.ejs
│      ├─ shop/*.ejs
│      ├─ exam_list/*.ejs
│      └─ info/*.ejs
├─ example.env                    # Environment variables template
├─ index.js                       # Application entry point
├─ package.json
└─ README.md
```

### คำอธิบายโฟลเดอร์หลัก

| โฟลเดอร์ | บทบาท |
|----------|--------|
| `app/config/` | ไฟล์ตั้งค่าระบบ เช่น การเชื่อมต่อฐานข้อมูล |
| `app/controller/` | รับ request จาก route แล้วเรียก service หรือ render view |
| `app/middleware/` | Middleware สำหรับ Express เช่น JWT verification |
| `app/model/` | Data access layer (models) — เรียก query/execute กับฐานข้อมูล |
| `app/routes/` | กำหนดเส้นทาง URL ทั้ง frontend และ API |
| `app/service/` | Business logic + validation |
| `assets/` | Static assets: CSS, JavaScript, รูปภาพ, fonts |
| `docs/framework/` | เอกสาร framework |
| `tools/` | เครื่องมือช่วยพัฒนา เช่น LiveReload |
| `views/` | EJS templates: layouts, partials, pages |

---

## โครงสร้าง Layer

```text
Browser
   │
   ├──► Frontend Route  (render EJS + layout)
   │        app/routes/frontend/eol/eol.routes.js
   │        app/controller/eol/eoltest.controller.js
   │
   └──► API Route       (รับ JSON/form-data → ส่ง JSON)
            app/routes/api/eol/eol.api.routes.js
            app/controller/api/eol/eol.api.controller.js

   Service Layer
        app/service/eol/*.service.js

   Data Layer
        app/model/eol/*.model.js
```

---

## หน้าที่ของแต่ละ Layer

### 1. Frontend Route / Controller

- รับ `req.user` จาก JWT middleware
- เรียก service เพื่อเตรียม **ข้อมูลเริ่มต้นสำหรับ render** เท่านั้น
- ส่งต่อให้ `res.render(...)` พร้อม `layout`
- **ห้าม** ประมวลผล POST / form submission / redirect

```js
router.get('/business', verifyToken, businessController.get);
```

### 2. API Route / Controller

- รับ `POST` พร้อม JSON หรือ `multipart/form-data`
- เรียก service ประมวลผล
- ส่ง JSON กลับในรูปแบบมาตรฐาน:

```json
{ "ok": true, "message": "...", "data": {} }
```

หรือ

```json
{ "ok": false, "message": "..." }
```

```js
router.post('/refill', verifyToken, eolApiController.postRefill);
```

### 3. Service Layer

- รับผิดชอบ **validation** และ **business logic**
- คืนค่าเป็น object:
  - `{ ok: true, data: { ... } }` เมื่อสำเร็จ
  - `{ ok: false, code: '...', message: '...' }` เมื่อล้มเหลว
- บางกรณีอาจ `throw new Error(...)` พร้อมติด `err.code`

### 4. Data Layer

- เรียก `mysqli.query()` / `mysqli.execute()` โดยตรง
- ใช้ **prepared statement** (`?`) ทุกครั้ง
- ไม่มี ORM หรือ query builder

```js
const [rows] = await mysqli.query('SELECT * FROM users WHERE id = ?', [userId]);
```

### 5. EJS View

- EJS view เป็น **Static HTML markup ล้วน ๆ**
- ไม่มี `<%= %>`, `<% if %>`, `<% for %>`, หรือ EJS syntax อื่น ๆ ที่ใช้ render ข้อมูลจาก server
- ฟอร์มต้องมี `id` และปุ่มต้องเป็น `type="button"` หรือใช้ `event.preventDefault()`
- ใช้ inline `<script>` เพื่อ `fetch()` โหลดข้อมูลจาก API แล้ว update DOM โดยตรง
- ไม่ใช้ server-side redirect หรือ query string error/success
- ข้อมูล dynamic ทั้งหมดรวมถึง challenge token ต้องโหลดผ่าน API ก่อนการ submit

ตัวอย่าง:

```html
<form id="refillForm" onsubmit="event.preventDefault();">
  <input type="hidden" id="verifyToken" name="verifyToken">
  ...
  <button type="button" onclick="submitRefill()">Refill</button>
</form>
<div id="refillMsg"></div>

<script>
// โหลด challenge token ก่อน
fetch('/api/eol/challenge', {
  credentials: 'include',
  method: 'GET'
})
  .then(res => res.json())
  .then(data => {
    document.getElementById('verifyToken').value = data.token;
  });

function submitRefill() {
  const form = document.getElementById('refillForm');
  const msg = document.getElementById('refillMsg');
  msg.style.display = 'none';
  fetch('/api/eol/refill', {
    method: 'POST',
    credentials: 'include',
    body: new URLSearchParams(new FormData(form))
  })
    .then(res => res.json())
    .then(data => {
      msg.style.display = '';
      msg.innerHTML = '<font color="' + (data.ok ? 'green' : 'red') + '">' + data.message + '</font>';
      if (data.ok) {
        form.reset();
        setTimeout(() => window.location.reload(), 1200);
      }
    });
}
</script>
```

---

## มาตรฐาน Endpoint

### Phase 2 EOL Migration

| ฟีเจอร์ | Method | Endpoint |
|--------|--------|----------|
| Get Challenge Token | GET | `/api/eol/challenge` |
| Refill | POST | `/api/eol/refill` |
| Update Profile | POST | `/api/eol/profile` |
| Change Password | POST | `/api/eol/password` |

หน้าเริ่มต้นยังคง render ผ่าน:

```text
GET /eol/eoltest
GET /eol/eoltest/refill
GET /eol/eoltest/edit_profile
```

### รูปแบบ Response มาตรฐาน

```json
{
  "ok": true,
  "message": "ดำเนินการสำเร็จ",
  "data": { }
}
```

```json
{
  "ok": false,
  "message": "ข้อมูลไม่ถูกต้อง"
}
```

---

## ข้อห้าม

- ห้าม **SSR (Server-Side Rendering)** ใน EJS view — ไม่มี `<%= %>`, `<% if %>`, `<% for %>`, หรือการส่งข้อมูลจาก controller มา render
- ห้ามให้ EJS view มี form ที่ `action` ชี้ไปยัง frontend route
- ห้ามให้ frontend controller ประมวลผล POST แล้ว redirect
- ห้ามใช้ `async/await` กับ `fetch()` ใน client-side (ใช้ Promise chain ตาม `CONTRIBUTING.md`)
- ห้ามสร้างฟังก์ชัน render แยกสำหรับ client-side
- ห้ามใส่ business logic ลงใน EJS view
- ห้าม API route return ค่าอื่นที่ไม่ใช่ JSON
- ห้ามฝัง challenge token หรือข้อมูล dynamic ลงใน HTML โดยตรงจาก server

---

## การเพิ่มหน้าใหม่

1. สร้างหรือใช้ service ที่มี business logic ใน `app/service/<module>/`
2. สร้าง API controller + route ภายใต้ `app/controller/api/<module>/` และ `app/routes/api/<module>/`
3. Mount API route ใน `app/routes/api/api.routes.js`
4. สร้าง frontend controller ใน `app/controller/<module>/` (ถ้าจำเป็น)
5. สร้าง frontend route ใน `app/routes/frontend/<module>/`
6. สร้าง/แก้ไข EJS view ใน `views/page/<module>/<page>.ejs`
7. ใช้ HTML + inline JS เรียก API ผ่าน `fetch()`
8. Frontend controller รับผิดชอบ render ข้อมูลเริ่มต้นเท่านั้น

---

<p align="center">
  ดูเพิ่มเติม: <a href="CONTRIBUTING.md">กฎการเขียนโค้ด</a> · <a href="ROUTING.md">Routing Concept</a> · <a href="DATABASE.md">ฐานข้อมูล</a>
</p>
