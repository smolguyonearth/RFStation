# 🗄️ วิธีเปิดใช้งาน Database (Supabase) กลับมา

> เอกสารนี้อธิบายขั้นตอนการเปิดใช้งาน Supabase Database กลับมา  
> ค้นหา `[DB DISABLED]` ในโค้ดเพื่อดูจุดที่ถูก comment ไว้

---

## สถานะปัจจุบัน

ระบบทำงานแบบ **pass-through** — ESP32 ส่งข้อมูลมาที่ Backend → Backend broadcast ผ่าน WebSocket → Frontend แสดงผล real-time  
**ไม่มี** การเก็บข้อมูลลง Database ไม่มี history ย้อนหลัง

---

## ขั้นตอนเปิดใช้งาน

### 1. ตั้งค่า Environment Variables

#### Backend (`backend/.env`)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

#### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

### 2. สร้าง Database Tables

รัน SQL จากไฟล์ [`db/init.sql`](file:///Users/nitisj/Workspace/Internship/Station/db/init.sql) ใน Supabase SQL Editor

---

### 3. เปิดโค้ดที่ถูก Comment ไว้

ค้นหา `[DB DISABLED]` ในไฟล์ต่อไปนี้แล้ว uncomment:

#### ไฟล์ที่ต้องแก้

| ไฟล์ | สิ่งที่ต้องทำ |
|------|-------------|
| `backend/src/index.ts` | Uncomment `import { supabase }` + เปลี่ยน `/api/ingest` กลับเป็น `async` + uncomment DB write code |
| `frontend/src/pages/Monitor.tsx` | Uncomment `import { supabase }` + uncomment `init()` function ที่ query `device_history` |
| `frontend/src/App.tsx` | Uncomment `import Live` + uncomment `<Route path="/live" ... />` |
| `frontend/src/constants/nav_menu.ts` | Uncomment nav entry สำหรับ `/live` |

---

### 4. รายละเอียดการแก้แต่ละไฟล์

#### `backend/src/index.ts`

```diff
- // import { supabase } from './lib/supabase'
+ import { supabase } from './lib/supabase'
```

เปลี่ยน `/api/ingest` กลับเป็น:
```diff
-  .post('/api/ingest', ({ body, server }) => {
+  .post('/api/ingest', async ({ body, server }) => {
```

แล้ว uncomment block DB write ทั้งหมด (Promise.all + error checking)

#### `frontend/src/pages/Monitor.tsx`

```diff
- // import { supabase } from "@/lib/supabaseClient"
+ import { supabase } from "@/lib/supabaseClient"
```

แล้ว uncomment `init()` function + `init();` call

#### `frontend/src/App.tsx`

```diff
- // import Live from "@/pages/Live"
+ import Live from "@/pages/Live"
```

```diff
- {/* [DB DISABLED] <Route path="/live" element={<Live />} /> */}
+ <Route path="/live" element={<Live />} />
```

#### `frontend/src/constants/nav_menu.ts`

```diff
- // { title: "nav.live", path: "/live", icon: Monitor },
+ { title: "nav.live", path: "/live", icon: Monitor },
```

---

### 5. ตรวจสอบ

- [ ] Backend start ได้โดยไม่ error
- [ ] POST `/api/ingest` เขียนข้อมูลลง Supabase สำเร็จ
- [ ] หน้า Monitor โหลด history จาก DB ตอนเปิดหน้า
- [ ] หน้า Live แสดง button status จาก Supabase Realtime

---

## หมายเหตุ

- Backend ใช้ **service_role key** (bypass RLS) — ไม่ใช่ anon key
- หน้า `Live.tsx` ใช้ Supabase Realtime ฟัง table `button_status` — table นี้ **ไม่มีใน `db/init.sql`** ต้องสร้างเองถ้าต้องการใช้
- `@supabase/supabase-js` ยังอยู่ใน `package.json` ทั้ง backend และ frontend — **ไม่ต้องติดตั้งเพิ่ม**
