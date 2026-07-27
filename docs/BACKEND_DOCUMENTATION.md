# 📖 Backend Documentation — RFStation

> เอกสารอธิบาย API Endpoints ทั้งหมด + วิธีที่ Frontend ติดต่อกับ Backend พร้อมตัวอย่างโค้ด

---

## สารบัญ

1. [GET vs POST คืออะไร?](#1-get-vs-post-คืออะไร)
2. [API Endpoints ทั้งหมด](#2-api-endpoints-ทั้งหมด)
3. [Frontend ติดต่อ Backend ยังไง](#3-frontend-ติดต่อ-backend-ยังไง)
4. [WebSocket — ข้อมูล Real-time](#4-websocket--ข้อมูล-real-time)
5. [สรุปภาพรวมทั้งหมด](#5-สรุปภาพรวมทั้งหมด)

---

## 1. GET vs POST คืออะไร?

ก่อนจะดู Endpoints ต้องเข้าใจ HTTP Method 2 ตัวนี้ก่อน:

| | **GET** | **POST** |
|--|---------|----------|
| ความหมาย | **"ขอดูข้อมูล"** | **"ส่งข้อมูลไปทำอะไรบางอย่าง"** |
| เปรียบเทียบ | ถามพนักงาน "ตอนนี้สถานะเป็นยังไง?" | สั่งพนักงาน "ทำสิ่งนี้ให้หน่อย" |
| มี Body (ข้อมูลแนบ) ไหม? | ❌ ไม่มี — แค่เรียก URL | ✅ มี — แนบ JSON ไปด้วย |
| เปลี่ยนแปลงข้อมูลไหม? | ไม่เปลี่ยน (แค่อ่าน) | เปลี่ยน (สร้าง / แก้ไข) |

**หลักง่ายๆ:** แค่อ่าน → `GET` / จะเปลี่ยนแปลงอะไร → `POST`

---

## 2. API Endpoints ทั้งหมด

> Endpoint = "ที่อยู่ URL" ที่ Backend รอรับ request
> กำหนดไว้ในไฟล์: [`backend/src/index.ts`](file:///Users/nitisj/Workspace/Internship/Station/backend/src/index.ts)

### 2.1 `GET /api/game/status` — ดึงสถานะเกม

| รายละเอียด | ค่า |
|-----------|-----|
| **Method** | GET |
| **ใครเรียก** | Frontend (ตอนโหลดหน้า Game) |
| **ส่งอะไรไป** | ไม่ต้องส่งอะไร |
| **ได้อะไรกลับ** | สถานะเกมทั้งหมด |

```typescript
// Backend (index.ts)
.get('/api/game/status', () => {
    return { success: true, game: game.getSnapshot() };
})
```

**ตัวอย่าง Response:**
```json
{
  "success": true,
  "game": {
    "state": "playing",
    "currentPlayer": 1,
    "turnsLeft": 8,
    "matrix": [[1, 0, 2], [0, 1, 0]],
    "battleContext": null,
    "scores": { "1": 0, "2": 0 }
  }
}
```

---

### 2.2 `GET /api/led/status/raw` — ดึงสถานะ LED

| รายละเอียด | ค่า |
|-----------|-----|
| **Method** | GET |
| **ใครเรียก** | ESP32 (poll ทุก 1 วินาที) |
| **ส่งอะไรไป** | ไม่ต้องส่งอะไร |
| **ได้อะไรกลับ** | String คั่นด้วย comma เช่น `"1,0,2,0,1,0"` |

```typescript
// Backend (index.ts)
.get('/api/led/status/raw', () => {
    return game.matrix.flat().join(',');
})
```

**ค่าแต่ละตัวหมายถึง:**

| ค่า | ความหมาย |
|-----|---------|
| `0` | ว่าง |
| `1` | Player 1 ครอบครอง |
| `2` | Player 2 ครอบครอง |
| `3` | Battle Mode (กะพริบ) |

---

### 2.3 `POST /api/game/start` — เริ่มเกม

| รายละเอียด | ค่า |
|-----------|-----|
| **Method** | POST |
| **ใครเรียก** | Frontend (กดปุ่ม "Player X Starts") |
| **ส่งอะไรไป** | `{ "startingPlayer": 1 }` หรือ `2` |
| **ได้อะไรกลับ** | `{ "success": true }` |
| **ผลข้างเคียง** | Broadcast `game_update` ผ่าน WebSocket |

```typescript
// Backend (index.ts)
.post('/api/game/start', ({ body, server }) => {
    game.startGame(body.startingPlayer);
    server?.publish('live-data', JSON.stringify({
      type: 'game_update',
      game: game.getSnapshot()
    }));
    return { success: true };
}, {
    body: t.Object({
      startingPlayer: t.Number()
    })
})
```

---

### 2.4 `POST /api/action` — กดปุ่ม (สำคัญที่สุด)

> นี่คือจุดเชื่อมระหว่าง Hardware กับ Game Logic

| รายละเอียด | ค่า |
|-----------|-----|
| **Method** | POST |
| **ใครเรียก** | ESP32 (กดปุ่มจริง) หรือ Frontend (กดช่อง matrix ใน UI) |
| **ส่งอะไรไป** | `{ "button_id": 0 }` ถึง `{ "button_id": 5 }` |
| **ได้อะไรกลับ** | String LED state เช่น `"1,0,2,0,1,0"` |
| **ผลข้างเคียง** | ถ้า state เปลี่ยน → Broadcast `game_update` ผ่าน WebSocket |

```typescript
// Backend (index.ts)
.post('/api/action', ({ body, server }) => {
    const { button_id } = body;

    if (button_id >= 0 && button_id < 6) {
      const row = Math.floor(button_id / 3);  // 0-2 → row 0, 3-5 → row 1
      const col = button_id % 3;              // 0,3 → col 0 ...

      const changed = game.handleAction(row, col);

      if (changed) {
        server?.publish('live-data', JSON.stringify({
          type: 'game_update', game: game.getSnapshot()
        }));
      }
      return game.matrix.flat().join(',');
    }
    return "INVALID";
}, {
    body: t.Object({ button_id: t.Number() })
})
```

**Button ID → ตำแหน่ง Matrix:**
```
┌────────┬────────┬────────┐
│ btn 0  │ btn 1  │ btn 2  │  ← Row 0
│ [0,0]  │ [0,1]  │ [0,2]  │
├────────┼────────┼────────┤
│ btn 3  │ btn 4  │ btn 5  │  ← Row 1
│ [1,0]  │ [1,1]  │ [1,2]  │
└────────┴────────┴────────┘
```

---

### 2.5 `POST /api/game/resolve` — ตัดสิน Battle

| รายละเอียด | ค่า |
|-----------|-----|
| **Method** | POST |
| **ใครเรียก** | Frontend (กดปุ่ม "Player X Wins" ใน Battle Modal) |
| **ส่งอะไรไป** | `{ "winner": 1 }` หรือ `{ "winner": 2 }` |
| **ได้อะไรกลับ** | `{ "success": true }` |
| **ผลข้างเคียง** | Broadcast `game_update` ผ่าน WebSocket |

```typescript
// Backend (index.ts)
.post('/api/game/resolve', ({ body, server }) => {
    game.resolveBattle(body.winner);
    server?.publish('live-data', JSON.stringify({
      type: 'game_update', game: game.getSnapshot()
    }));
    return { success: true };
}, {
    body: t.Object({ winner: t.Number() })
})
```

---

### 2.6 `POST /api/game/reset` — Reset เกม

| รายละเอียด | ค่า |
|-----------|-----|
| **Method** | POST |
| **ใครเรียก** | Frontend (กดปุ่ม "Restart Game") |
| **ส่งอะไรไป** | ไม่ต้องส่งอะไร |
| **ได้อะไรกลับ** | `{ "success": true }` |
| **ผลข้างเคียง** | Broadcast `game_update` ผ่าน WebSocket |

```typescript
// Backend (index.ts)
.post('/api/game/reset', ({ server }) => {
    game.resetGame();
    server?.publish('live-data', JSON.stringify({
      type: 'game_update', game: game.getSnapshot()
    }));
    return { success: true };
})
```

---

### 2.7 `POST /api/ingest` — รับข้อมูล BLE Device

> Endpoint นี้ใช้สำหรับ **Device Monitoring** ไม่เกี่ยวกับเกม

| รายละเอียด | ค่า |
|-----------|-----|
| **Method** | POST |
| **ใครเรียก** | ESP32 (BLE bridge) หรือ Raspberry Pi |
| **ส่งอะไรไป** | `{ "device_code": "P1", "nearest_device": "AR", "rssi": -45, "zone_code": "AR" }` |
| **ได้อะไรกลับ** | `{ "success": true }` |
| **ผลข้างเคียง** | Broadcast ข้อมูลดิบผ่าน WebSocket |

```typescript
// Backend (index.ts)
.post('/api/ingest', ({ body, server }) => {
    server?.publish('live-data', JSON.stringify(body));
    return { success: true }
}, {
    body: t.Object({
      device_code: t.String(),
      nearest_device: t.String(),
      rssi: t.Number(),
      zone_code: t.Optional(t.String())
    })
})
```

---

### 2.8 `WS /ws` — WebSocket Connection

| รายละเอียด | ค่า |
|-----------|-----|
| **ใครเชื่อมต่อ** | Frontend (React) |
| **Pub/Sub Channel** | `live-data` |
| **ทำอะไร** | Client connect แล้ว subscribe เข้า channel เพื่อรับข้อมูล real-time |

```typescript
// Backend (index.ts)
.ws('/ws', {
    open(ws) {
      ws.subscribe('live-data')
      console.log('Frontend connected to WebSocket')
    }
})
```

---

## 3. Frontend ติดต่อ Backend ยังไง

Frontend ใช้ 2 วิธีในการคุยกับ Backend:

| วิธี | ใช้ทำอะไร | ใช้ function อะไร |
|------|----------|-----------------|
| **HTTP Request** (`fetch`) | ส่งคำสั่งไป Backend (เริ่มเกม, กดปุ่ม, reset) | `fetch()` |
| **WebSocket** | รับข้อมูล real-time จาก Backend (game update, device data) | `new WebSocket()` |

---

### 3.1 วิธี GET — ขอข้อมูล (ไม่ส่ง body)

**ใช้ตอนไหน:** ตอนโหลดหน้าเว็บครั้งแรก เพื่อดึงสถานะเกมปัจจุบัน

```typescript
// จาก Game.tsx (บรรทัด 26-38)

useEffect(() => {
    // เรียก GET /api/game/status — ไม่ต้องส่งอะไรไป แค่เรียก URL
    fetch("/api/game/status")
      .then((res) => res.json())          // แปลง response เป็น JSON
      .then((data) => {
        if (data.success) {
          setGame(data.game);             // เก็บ game state ใส่ state
        }
      })
      .catch((err) => setError(err.message));
}, []);  // [] = ทำครั้งเดียวตอน component mount
```

**อธิบาย:**
1. `fetch("/api/game/status")` → ส่ง GET request ไปที่ Backend
2. `.then((res) => res.json())` → แปลง response จาก text เป็น JavaScript object
3. `.then((data) => { ... })` → เอา data ไปใช้ (เช่น set state)
4. `useEffect(() => {...}, [])` → React Hook ที่ทำให้โค้ดนี้รันครั้งเดียวตอนหน้าเว็บโหลด

---

### 3.2 วิธี POST — ส่งข้อมูลไปสั่งทำอะไร

**ใช้ตอนไหน:** ตอนผู้ใช้กดปุ่มต่างๆ เช่น เริ่มเกม, กดช่อง, reset

#### ตัวอย่าง 1: เริ่มเกม

```typescript
// จาก Game.tsx (บรรทัด 92-100)

const handleStart = async (player: number) => {
    await fetch("/api/game/start", {
      method: "POST",                                    // ← บอกว่าเป็น POST
      headers: { "Content-Type": "application/json" },   // ← บอกว่าส่ง JSON
      body: JSON.stringify({ startingPlayer: player })    // ← ข้อมูลที่ส่งไป
    });
};
```

**อธิบาย:**
1. `method: "POST"` → บอก fetch ว่าเราจะส่งข้อมูลไป (ถ้าไม่ใส่ default คือ GET)
2. `headers: { "Content-Type": "application/json" }` → บอก Backend ว่าข้อมูลที่ส่งมาเป็น JSON
3. `body: JSON.stringify({ startingPlayer: player })` → แปลง object เป็น JSON string แล้วส่งไป
4. `async / await` → รอให้ request เสร็จก่อนทำอย่างอื่น

#### ตัวอย่าง 2: กดช่อง Matrix (จำลอง Hardware กดปุ่ม)

```typescript
// จาก Game.tsx (บรรทัด 102-113)

const handleAction = async (row: number, col: number) => {
    const button_id = row * 3 + col;   // แปลง [row, col] เป็น button_id (0-5)

    await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ button_id })
    });
};
```

**อธิบาย:**
- ผู้เล่นกดช่อง `[1, 2]` → `button_id = 1 * 3 + 2 = 5`
- ส่ง `{ "button_id": 5 }` ไปที่ `/api/action`
- Backend จะคำนวณ game logic แล้ว broadcast ผลผ่าน WebSocket

#### ตัวอย่าง 3: ตัดสิน Battle

```typescript
// จาก Game.tsx (บรรทัด 116-121)

const handleResolve = async (winner: number) => {
    await fetch("/api/game/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner })
    });
};
```

#### ตัวอย่าง 4: Reset เกม (POST แบบไม่ส่ง body)

```typescript
// จาก Game.tsx (บรรทัด 124-127)

const handleReset = async () => {
    await fetch("/api/game/reset", {
      method: "POST"    // ← POST แต่ไม่ต้องส่ง body เพราะ reset ไม่ต้องการข้อมูลเพิ่ม
    });
};
```

---

### 3.3 รูปแบบ fetch ครบสูตร

```typescript
// รูปแบบเต็มของ fetch:
const response = await fetch("URL", {
    method: "POST",                                    // GET หรือ POST
    headers: { "Content-Type": "application/json" },   // (ใช้กับ POST ที่มี body)
    body: JSON.stringify({ key: value })               // (ข้อมูลที่ส่งไป, เฉพาะ POST)
});

const data = await response.json();  // แปลง response เป็น object
```

| ส่วน | จำเป็นไหม | อธิบาย |
|------|----------|--------|
| `URL` | ✅ เสมอ | ที่อยู่ endpoint เช่น `"/api/game/start"` |
| `method` | ❌ (default = GET) | ถ้าเป็น GET ไม่ต้องใส่ก็ได้ |
| `headers` | ❌ (ใส่เมื่อมี body) | บอก Backend ว่าข้อมูลเป็น format อะไร |
| `body` | ❌ (เฉพาะ POST) | ข้อมูลที่แนบไป ต้อง `JSON.stringify()` ก่อน |

---

## 4. WebSocket — ข้อมูล Real-time

### 4.1 WebSocket คืออะไร?

- **fetch** = โทรถามทีละครั้ง ("สถานะเป็นยังไง?" → ได้คำตอบ → จบ)
- **WebSocket** = เปิดสายไว้ตลอด (Backend ส่งข้อมูลมาได้เรื่อยๆ โดยไม่ต้องถาม)

### 4.2 ตัวอย่าง: Game.tsx รับ WebSocket

```typescript
// จาก Game.tsx (บรรทัด 40-71)

useEffect(() => {
    // 1. เปิด WebSocket connection ไปที่ Backend
    const ws = new WebSocket(`ws://${window.location.host}/ws`);

    // 2. เมื่อได้รับข้อมูลจาก Backend
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);   // แปลง JSON string เป็น object

        // ถ้าเป็น game update → อัปเดต UI
        if (data.type === "game_update" && data.game) {
          setGame(data.game);
        }

        // ถ้าเป็น device data (จาก /api/ingest) → เล่นเสียง
        if (data.device_code && data.nearest_device) {
          // ... จัดการ device movement
        }
      } catch (e) {
        console.error("WS Parse error:", e);
      }
    };

    // 3. Cleanup: ปิด connection เมื่อ component unmount
    return () => ws.close();
}, []);
```

**อธิบาย:**
1. `new WebSocket(...)` → เปิดสาย (connection) ไปที่ Backend
2. `ws.onmessage = ...` → กำหนดว่า "ถ้ามีข้อมูลส่งมา ให้ทำอะไร"
3. Backend จะ `publish` ข้อมูลมาเอง ทุกครั้งที่มี event (เริ่มเกม, กดปุ่ม, reset, device data)
4. `return () => ws.close()` → ปิดสายเมื่อออกจากหน้า

### 4.3 ตัวอย่าง: Monitor.tsx รับ WebSocket

```typescript
// จาก Monitor.tsx (บรรทัด 44-63)

const ws = new WebSocket(`ws://${window.location.host}/ws`);

ws.onmessage = (event) => {
    try {
      const newData = JSON.parse(event.data) as DeviceData;

      // อัปเดต "สถานะล่าสุด" ของแต่ละ device
      setLatestByDevice((prev) => ({
        ...prev,
        [newData.device_code]: newData
      }));

      // เพิ่มเข้า history list
      setStream((prev) => [newData, ...prev]);

      // เล่นเสียงตาม zone
      if (newData.nearest_device !== "X") {
        AudioEngine.playZone(newData.nearest_device);
      }
    } catch (err) {
      console.error("Failed to parse ws message", err);
    }
};
```

### 4.4 ข้อมูลที่ส่งผ่าน WebSocket มี 2 ประเภท

#### ประเภท 1: Game Update (มี `type: "game_update"`)

```json
{
  "type": "game_update",
  "game": {
    "state": "playing",
    "currentPlayer": 2,
    "turnsLeft": 7,
    "matrix": [[1, 0, 2], [0, 1, 0]],
    "battleContext": null,
    "scores": { "1": 0, "2": 0 }
  }
}
```

**ส่งเมื่อ:** game start, action, resolve, reset
**Frontend แยกโดย:** `data.type === "game_update"`

#### ประเภท 2: Device Data (ไม่มี `type`)

```json
{
  "device_code": "P1",
  "nearest_device": "AR",
  "rssi": -45,
  "zone_code": "AR"
}
```

**ส่งเมื่อ:** `/api/ingest` ถูกเรียก (ESP32 ส่ง BLE data มา)
**Frontend แยกโดย:** `data.device_code && data.nearest_device`

---

## 5. สรุปภาพรวมทั้งหมด

### 5.1 ตาราง Endpoints ทุกตัว

| Endpoint | Method | ใครเรียก | ส่งอะไรไป | ได้อะไรกลับ |
|----------|--------|---------|-----------|------------|
| `/api/game/status` | GET | Frontend | - | สถานะเกม (JSON) |
| `/api/led/status/raw` | GET | ESP32 | - | LED string `"1,0,2,0,1,0"` |
| `/api/game/start` | POST | Frontend | `{ startingPlayer }` | `{ success }` |
| `/api/action` | POST | ESP32 / Frontend | `{ button_id }` | LED string |
| `/api/game/resolve` | POST | Frontend | `{ winner }` | `{ success }` |
| `/api/game/reset` | POST | Frontend | - | `{ success }` |
| `/api/ingest` | POST | ESP32 / RPi | `{ device_code, nearest_device, rssi }` | `{ success }` |
| `/ws` | WebSocket | Frontend | - | real-time data (game + device) |

### 5.2 ไฟล์ Frontend ที่เรียก Backend

| ไฟล์ | เรียกอะไร |
|------|----------|
| [`Game.tsx`](file:///Users/nitisj/Workspace/Internship/Station/frontend/src/pages/Game.tsx) | `GET /api/game/status` + `POST /api/game/start` + `POST /api/action` + `POST /api/game/resolve` + `POST /api/game/reset` + `WS /ws` |
| [`Monitor.tsx`](file:///Users/nitisj/Workspace/Internship/Station/frontend/src/pages/Monitor.tsx) | `WS /ws` เท่านั้น |
| [`useDeviceStream.ts`](file:///Users/nitisj/Workspace/Internship/Station/frontend/src/hooks/useDeviceStream.ts) | `WS /ws` เท่านั้น |

### 5.3 Flow Diagram

```
Frontend (Game.tsx)                    Backend (index.ts)
──────────────────                    ──────────────────
     │                                       │
     │── GET /api/game/status ──────────────►│  (โหลดหน้า → ขอสถานะ)
     │◄──── { game: {...} } ────────────────│
     │                                       │
     │── POST /api/game/start ─────────────►│  (กดปุ่ม Start)
     │◄──── { success: true } ─────────────│
     │                                       │
     │◄════ WS: game_update ═══════════════│  (Backend broadcast กลับมา)
     │                                       │
     │── POST /api/action ─────────────────►│  (กดช่อง matrix)
     │◄──── "1,0,2,0,1,0" ────────────────│
     │                                       │
     │◄════ WS: game_update ═══════════════│  (Backend broadcast ผลให้ทุก client)
     │                                       │

─── = HTTP Request/Response (ทีละครั้ง)
═══ = WebSocket (สายเปิดตลอด, Backend ส่งมาเองได้)
```
