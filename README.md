# EOL Website — Node.js / Express / EJS

<p align="center">
  <strong>เว็บ EOL System บน Node.js + Express + EJS</strong><br>
  เฟสปัจจุบัน: แก้ไข bugs / errors หลังจากย้ายมาจาก PHP เสร็จสิ้นแล้ว
</p>

---

## สถานะปัจจุบัน

- ✅ Migration จาก PHP มา Node.js เสร็จสิ้น
- 🔧 เฟสปัจจุบัน: **แก้ไข bugs และ errors** ที่เกิดจากการ migration
- 🔧 **CKEditor upload** ยังไม่ได้เชื่อมต่อ Node API (filemanager PHP ถูกลบออกแล้ว)
- 🔧 Test code ยังใช้โค้ดเวอร์ชันเก่า ยังไม่ได้อัปเดต
- ✅ ล้าง assets ที่ไม่ใช้แล้ว (event, images, sound) และเอา DB-referenced assets ออกจาก git tracking

---

## สารบัญ

- [เทคโนโลยี](#เทคโนโลยี)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [เริ่มต้นพัฒนา](#เริ่มต้นพัฒนา)
- [สิ่งที่ต้องระวัง](#สิ่งที่ต้องระวัง)
- [บัญชีทดสอบ](#บัญชีทดสอบ)
- [เอกสารอ้างอิง](#เอกสารอ้างอิง)
- [ทีมพัฒนา](#ทีมพัฒนา)

---

## เทคโนโลยี

| ส่วน | เทคโนโลยี |
|------|-----------|
| Runtime | Node.js 18+ |
| Web Framework | Express.js 5.x |
| Template Engine | EJS 4.x + express-ejs-layouts |
| Database | MySQL / MariaDB (`engtest_online`) |
| DB Driver | mysql2 |
| Authentication | JWT + httpOnly Cookie + express-session |
| Client-Side | Vanilla JavaScript + Fetch API |
| Dev Tools | Nodemon + LiveReload (optional) |
| File Upload | multer |
| Image Processing | jimp |

---

## โครงสร้างโปรเจกต์

```text
.
├─ app/
│  ├─ config/          # Database, session, JWT config
│  ├─ controller/      # Route controllers (frontend + API)
│  ├─ data/            # Static data / fixtures
│  ├─ middleware/      # Auth, role, error middleware
│  ├─ model/           # Database queries (mysql2)
│  ├─ routes/          # Express routers
│  │  ├─ api/          # JSON API routes
│  │  └─ frontend/     # EJS rendering routes
│  └─ service/         # Business logic
├─ assets/             # Static assets (CSS, JS, images, event uploads)
│  ├─ 2010/            # Legacy assets / user uploads
│  ├─ event/           # Event images (DB-referenced kept on disk, not in git)
│  ├─ js/              # Client-side scripts
│  └─ css/             # Stylesheets
├─ views/
│  ├─ components/      # Reusable EJS components
│  ├─ layouts/         # Layout templates
│  ├─ page/            # Page-specific EJS views
│  └─ partials/        # Header, footer, etc.
├─ docs/               # Architecture and cleanup docs
├─ tools/              # Helper scripts (event-cleanup, image-cleanup)
├─ index.js            # Entry point
├─ example.env         # Environment template
├─ nodemon.json        # Nodemon config
└─ server.log          # Runtime log (ถ้ามี)
```

---

## เริ่มต้นพัฒนา

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment

```bash
cp example.env .env
```

แก้ไขค่าใน `.env` ให้ตรงกับสภาพแวดล้อมและฐานข้อมูล:

```env
PORT=3000
LIVERELOAD=true

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=engtest_online

JWT_SECRET=your-secret-key
```

> ⚠️ ห้าม commit `.env` ขึ้น Git

### 3. รันเซิร์ฟเวอร์

```bash
npm run dev
```

เซิร์ฟเวอร์จะรันที่ `http://localhost:3000`

### 4. หยุดเซิร์ฟเวอร์ (ถ้าจำเป็น)

```bash
npm run kill
```

หรือหา PID แล้ว kill เอง:

```bash
netstat -ano | findstr ":3000"
```

---

## สิ่งที่ต้องระวัง

### 1. ห้ามเปลี่ยนรูปแบบการแสดงผล

ทุกหน้าต้องมีหน้าตาเหมือน PHP เดิม ตั้งแต่ layout, สี, ฟอนต์, ระยะห่าง

### 2. EJS เป็น Static Template เท่านั้น

- EJS view เป็น **Static HTML Template** เท่านั้น
- ห้ามใช้ `<%= %>`, `<% if %>`, `<% for %>` เพื่อ render ข้อมูลจาก server
- ข้อมูล dynamic ทั้งหมดต้องโหลดผ่าน **API + Client-Side JavaScript**

### 3. Coding Style

- CommonJS (`require` / `module.exports`)
- แยกชั้น View / Route / Controller / Service / Model
- Client-side ใช้ `fetch()` + `credentials: 'include'` + Promise chain
- ไม่ใช้ `async/await` กับ `fetch()` ใน client-side

### 4. Authentication

- JWT เก็บใน httpOnly Cookie
- Middleware ตรวจสอบสิทธิ์ที่ router
- API ต้องส่ง `credentials: 'include'` เสมอ

### 5. CKEditor Upload (ยังไม่เสร็จ)

- CKEditor ในหน้า backoffice ยังไม่มี upload endpoint
- filemanager PHP ถูกลบออกแล้ว ต้องสร้าง Node API รับไฟล์ภาพแทน
- ปัจจุบันปุ่ม Browse/Upload จะไม่ทำงาน (กดไม่ได้)

---

## บัญชีทดสอบ

### บัญชี Member / Corporate

| ประเภท | Username | Password | ชื่อ | สิทธิ์ | สถานะ |
|---|---|---|---|---|---|
| บุคคลทั่วไป | `rrmctgk1` | `rrmctgk1` | รุ่งโรจน์ เมืองเฉลิม | Member | Active |
| Corporate Sub | `rrmctgk2` | `rrmctgk2` | Test Sub | Corporate Member | Active |
| Corporate Master | `rrmctgk3` | `rrmctgk3` | Test Master | Master | Active |
| บุคคลทั่วไป | `rrmctgk4` | `rrmctgk4` | Test4 Last4 | Member | Active |
| Corporate Sub | `rrmctgk5` | `rrmctgk5` | Test5 Last5 | Corporate Member | Active |
| Corporate Master | `rrmctgk6` | `rrmctgk6` | Test6 Last6 | Master | Active |

### บัญชี Backoffice

| Section | Table | Username | Password | หมายเหตุ |
|---|---|---|---|---|
| Office | `tbl_web_admin` | `rungrot` | `muangchalerm` | Webmaster |
| Admin | `tbl_admin` | `rungrot` | `Muangchalerm` | Academician |

### บัญชี 1 Year Course

| Table | Username | Password | สถานะ |
|---|---|---|---|
| `tbl_x_member_1year` | `rrmctgk1yc` | `rrmctgk1yc` | Active |

> ⚠️ บัญชีทดสอบเป็นข้อมูลจริงในฐานข้อมูล ใช้เฉพาะการทดสอบเท่านั้น

---

## เอกสารอ้างอิง

- [DevTeam Framework 2 Documentation](docs/framework/README.md)
- [Architecture Guide](docs/framework/ARCHITECTURE.md)
- [Coding Rules](docs/framework/CONTRIBUTING.md)
- [Environment Variables](docs/framework/ENVIRONMENT.md)
- [Database](docs/framework/DATABASE.md)
- [JWT Middleware](docs/framework/JWT-MIDDLEWARE.md)
- [Event Assets Analysis](docs/event_assets_summary.md)
- [Event Archive Plan](docs/event_archive_plan.md)

---

## ทีมพัฒนา

พัฒนาโดย **DevTeam**

---

<p align="center">
  <strong>แก้ไข bugs อย่างต่อเนื่อง — รักษาประสบการณ์ผู้ใช้ไว้เหมือนเดิม</strong>
</p>
