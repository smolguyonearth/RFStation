# 📖 Backend Documentation — RFStation

> เอกสารอธิบาย Backend ทั้งหมดแบบละเอียด: สถาปัตยกรรม, Logic, โค้ด, การเชื่อมต่อกับ Frontend และ Hardware

---

## สารบัญ

1. [ภาพรวมระบบทั้งหมด (System Overview)](#1-ภาพรวมระบบทั้งหมด)
2. [Technology Stack](#2-technology-stack)
3. [โครงสร้างไฟล์ Backend](#3-โครงสร้างไฟล์-backend)
4. [Entry Point — index.ts](#4-entry-point--indexts)
5. [API Endpoints ทั้งหมด](#5-api-endpoints-ทั้งหมด)
6. [WebSocket — Real-time Communication](#6-websocket--real-time-communication)
7. [Game Logic — gameLogic.ts](#7-game-logic--gamelogicts)
8. [Supabase Database](#8-supabase-database)
9. [การเชื่อมต่อกับ Hardware (ESP32 / Arduino / Calliope / RPi)](#9-การเชื่อมต่อกับ-hardware)
10. [การเชื่อมต่อกับ Frontend](#10-การเชื่อมต่อกับ-frontend)
11. [Docker & Deployment](#11-docker--deployment)
12. [Data Flow Diagrams](#12-data-flow-diagrams)

---

## 1. ภาพรวมระบบทั้งหมด

โปรเจกต์นี้เป็นระบบ **Interactive Station** ที่ประกอบด้วย 2 ฟีเจอร์หลัก:

### ฟีเจอร์ที่ 1: Device Monitoring (ติดตามอุปกรณ์)
- อุปกรณ์ Calliope Mini ส่งสัญญาณ BLE → ESP32/RPi รับสัญญาณ → ส่งข้อมูลขึ้น Backend → Backend บันทึกลง Supabase + broadcast ผ่าน WebSocket → Frontend แสดงผล real-time

### ฟีเจอร์ที่ 2: Battle Matrix Game (เกมยึดพื้นที่)
- ผู้เล่น 2 คน กดปุ่มบน Arduino เพื่อยึดพื้นที่บน matrix 2×3 → ESP32 ส่ง button press ขึ้น Backend → Backend คำนวณ game logic → broadcast ผล ผ่าน WebSocket → Frontend + LED Matrix แสดงผล

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SYSTEM ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    Serial/UART     ┌───────────────┐              │
│  │ Calliope Mini│ ──────────────────►│  ESP32 (BLE)  │              │
│  │  (BLE Tags)  │                    │  หรือ RPi     │              │
│  └──────────────┘                    └───────┬───────┘              │
│                                              │ HTTP POST            │
│                                              │ /api/ingest          │
│                                              ▼                      │
│  ┌──────────────┐    I2C (0x09)      ┌───────────────┐              │
│  │   Arduino    │ ──────────────────►│  ESP32 (Game) │              │
│  │  (Buttons)   │                    │  testESP32    │              │
│  └──────────────┘                    │  connectweb   │              │
│                                      └───────┬───────┘              │
│  ┌──────────────┐    I2C (0x08)              │ HTTP POST            │
│  │   Arduino    │ ◄──────────────────────────│ /api/action          │
│  │  (LED 4×3)   │                    GET /api/led/status/raw        │
│  └──────────────┘                            │                      │
│                                              ▼                      │
│                                    ┌─────────────────┐              │
│                                    │    BACKEND       │              │
│                                    │  (Bun + Elysia) │              │
│                                    │    Port 3000     │              │
│                                    └────────┬────────┘              │
│                                   ┌─────────┼─────────┐            │
│                                   │         │         │             │
│                                   ▼         ▼         ▼             │
│                             ┌─────────┐ ┌───────┐ ┌──────────┐     │
│                             │Supabase │ │  WS   │ │ In-Memory│     │
│                             │   DB    │ │Pub/Sub│ │GameState │     │
│                             └─────────┘ └───┬───┘ └──────────┘     │
│                                             │                       │
│                                             ▼                       │
│                                    ┌─────────────────┐              │
│                                    │    FRONTEND      │              │
│                                    │  (React + Vite)  │              │
│                                    │    Port 5173     │              │
│                                    └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | หน้าที่ |
|-------|-----------|---------|
| Runtime | **Bun** | JavaScript/TypeScript runtime ที่เร็วกว่า Node.js |
| Framework | **Elysia** | Web framework สำหรับ Bun (รองรับ HTTP + WebSocket) |
| Database | **Supabase** (PostgreSQL) | เก็บข้อมูล devices, status, history |
| Frontend | **React + Vite + TypeScript** | UI แสดงผล real-time |
| Container | **Docker + Docker Compose** | deploy ทั้ง backend + frontend |
| Hardware | **ESP32, Arduino, Calliope Mini, Raspberry Pi** | IoT devices |

---

## 3. โครงสร้างไฟล์ Backend

```
backend/
├── .env                    # Supabase credentials (SUPABASE_URL, SUPABASE_KEY)
├── Dockerfile              # Docker image สำหรับ Bun runtime
├── package.json            # Dependencies: elysia, @supabase/supabase-js
├── tsconfig.json           # TypeScript config
├── bun.lock                # Bun lockfile
└── src/
    ├── index.ts            # ★ Entry point — สร้าง server, กำหนด routes ทั้งหมด
    ├── gameLogic.ts         # ★ Game Logic class — state machine ของเกม
    └── lib/
        └── supabase.ts     # Supabase client initialization
```

---

## 4. Entry Point — index.ts

> ไฟล์: [`backend/src/index.ts`](file:///Users/nitisj/Workspace/Internship/Station/backend/src/index.ts)

นี่คือหัวใจของ Backend ทั้งหมด ทำหน้าที่:

### 4.1 การ Initialize

```typescript
import { Elysia, t } from 'elysia'
import { supabase } from './lib/supabase'
import { GameLogic } from './gameLogic'

const game = new GameLogic()   // สร้าง instance เก็บ game state ไว้ใน memory

const app = new Elysia()
  // ... routes ...
  .listen({ port: 3000, hostname: '0.0.0.0' })
```

**สิ่งสำคัญ:**
- `game` เป็น **singleton in-memory object** — state ของเกมอยู่ใน RAM ไม่ได้เก็บใน DB
- Server listen ที่ `0.0.0.0:3000` เพื่อให้ devices ภายใน network เดียวกันเข้าถึงได้

---

## 5. API Endpoints ทั้งหมด

### 5.1 WebSocket Endpoint

```
WS /ws
```

| รายละเอียด | ค่า |
|-----------|-----|
| **ใครเชื่อมต่อ** | Frontend (React) |
| **Pub/Sub Channel** | `live-data` |
| **ทำอะไร** | เมื่อ client connect จะ subscribe เข้า channel `live-data` เพื่อรับข้อมูล real-time |

```typescript
.ws('/ws', {
    open(ws) {
      ws.subscribe('live-data')         // subscribe เข้า channel
      console.log('Frontend connected to WebSocket')
    }
  })
```

**หลักการทำงาน:**
1. Frontend เปิด WebSocket connection มาที่ `ws://<host>/ws`
2. Server subscribe client เข้า channel `live-data`
3. เมื่อมี event ใดๆ (game update, device data) server จะ `publish` ไปที่ channel นี้
4. ทุก client ที่ subscribe จะได้รับข้อมูลพร้อมกัน (broadcast)

---

### 5.2 `GET /api/game/status`

| รายละเอียด | ค่า |
|-----------|-----|
| **ใครเรียก** | Frontend (ตอน page load) |
| **ทำอะไร** | ดึงสถานะเกมปัจจุบัน |
| **Response** | `{ success: true, game: { state, currentPlayer, turnsLeft, matrix, battleContext, scores } }` |

```typescript
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

### 5.3 `GET /api/led/status/raw`

| รายละเอียด | ค่า |
|-----------|-----|
| **ใครเรียก** | ESP32 (Game Controller) — poll ทุก 1 วินาที |
| **ทำอะไร** | ส่งสถานะ LED matrix เป็น comma-separated string |
| **Response** | `"1,0,2,0,1,0"` (แต่ละตัวเลขคือ owner ของแต่ละช่อง) |

```typescript
.get('/api/led/status/raw', () => {
    // Returns comma separated string: row0col0,row0col1,...
    return game.matrix.flat().join(',');
  })
```

**การ Mapping ค่า:**
```
matrix[0][0], matrix[0][1], matrix[0][2], matrix[1][0], matrix[1][1], matrix[1][2]
     ↓             ↓             ↓             ↓             ↓             ↓
  position 0    position 1    position 2    position 3    position 4    position 5
```

**ความหมายของค่า:**
| ค่า | ความหมาย | LED |
|-----|---------|-----|
| `0` | ว่าง | ดับทั้งหมด |
| `1` | Player 1 เป็นเจ้าของ | LED น้ำเงินติด |
| `2` | Player 2 เป็นเจ้าของ | LED แดงติด |
| `3` | Battle Mode | LED น้ำเงิน + แดง กะพริบ |

---

### 5.4 `POST /api/game/start`

| รายละเอียด | ค่า |
|-----------|-----|
| **ใครเรียก** | Frontend (กดปุ่ม "Player X Starts") |
| **Body** | `{ "startingPlayer": 1 }` หรือ `{ "startingPlayer": 2 }` |
| **ทำอะไร** | เริ่มเกมใหม่ โดยกำหนดว่าใครเริ่มก่อน |

```typescript
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

**Flow:**
1. เรียก `game.startGame()` → reset matrix, set state เป็น `'playing'`
2. Broadcast `game_update` ผ่าน WebSocket → Frontend อัปเดต UI
3. ESP32 จะ poll `/api/led/status/raw` ในรอบถัดไป → LED matrix อัปเดต

---

### 5.5 `POST /api/action`

| รายละเอียด | ค่า |
|-----------|-----|
| **ใครเรียก** | ESP32 (Game Controller) — เมื่อผู้เล่นกดปุ่ม |
| **Body** | `{ "button_id": 0 }` ถึง `{ "button_id": 5 }` |
| **ทำอะไร** | ประมวลผลการกดปุ่ม → อัปเดต game state |
| **Response** | สถานะ LED matrix เป็น string `"1,0,2,0,1,0"` (ส่งกลับ ESP32 เพื่อ sync ทันที) |

> [!IMPORTANT]
> นี่คือ endpoint ที่สำคัญที่สุด — เป็นจุดเชื่อมระหว่าง Hardware กับ Game Logic

```typescript
.post('/api/action', ({ body, server }) => {
    const { button_id } = body;

    // Map button_id (0-5) to row/col
    if (button_id >= 0 && button_id < 6) {
      const row = Math.floor(button_id / 3);   // 0-2 → row 0, 3-5 → row 1
      const col = button_id % 3;               // 0,3 → col 0, 1,4 → col 1, 2,5 → col 2

      const changed = game.handleAction(row, col);

      if (changed) {
        // Broadcast ไปยัง Frontend ผ่าน WebSocket
        server?.publish('live-data', JSON.stringify({
          type: 'game_update',
          game: game.getSnapshot()
        }));
      }

      // ส่ง raw state กลับ ESP32 เสมอ เพื่อ sync LED
      return game.matrix.flat().join(',');
    }

    return "INVALID";
  }, {
    body: t.Object({
      button_id: t.Number()
    })
  })
```

**Button ID Mapping:**
```
┌─────────────────────────────────────┐
│  Button Layout (2 แถว × 3 คอลัมน์)    │
├─────────┬─────────┬─────────────────┤
│  btn 0  │  btn 1  │  btn 2          │   ← Row 0
│ [0,0]   │ [0,1]   │ [0,2]           │
├─────────┼─────────┼─────────────────┤
│  btn 3  │  btn 4  │  btn 5          │   ← Row 1
│ [1,0]   │ [1,1]   │ [1,2]           │
└─────────┴─────────┴─────────────────┘
```

**Response Flow:**
1. ESP32 POST `{ button_id: 2 }` → Backend แปลงเป็น `[row=0, col=2]`
2. `game.handleAction(0, 2)` ประมวลผลตาม game rules
3. ถ้า state เปลี่ยน → broadcast WebSocket ให้ Frontend
4. Return `"1,0,1,0,2,0"` กลับ ESP32 → ESP32 ส่ง I2C ไป LED Arduino

---

### 5.6 `POST /api/game/resolve`

| รายละเอียด | ค่า |
|-----------|-----|
| **ใครเรียก** | Frontend (กดปุ่ม "Player X Wins" ใน Battle Modal) |
| **Body** | `{ "winner": 1 }` หรือ `{ "winner": 2 }` |
| **ทำอะไร** | ตัดสินผลการ Battle — ผู้ชนะได้ครอบครองช่องนั้น |

```typescript
.post('/api/game/resolve', ({ body, server }) => {
    game.resolveBattle(body.winner);
    server?.publish('live-data', JSON.stringify({
      type: 'game_update',
      game: game.getSnapshot()
    }));
    return { success: true };
  }, {
    body: t.Object({
      winner: t.Number()
    })
  })
```

---

### 5.7 `POST /api/game/reset`

| รายละเอียด | ค่า |
|-----------|-----|
| **ใครเรียก** | Frontend (กดปุ่ม "Restart Game") |
| **ทำอะไร** | Reset เกมกลับไปสถานะ `setup` ทั้งหมด |

```typescript
.post('/api/game/reset', ({ server }) => {
    game.resetGame();
    server?.publish('live-data', JSON.stringify({
      type: 'game_update',
      game: game.getSnapshot()
    }));
    return { success: true };
  })
```

> [!NOTE]
> ESP32 จะ poll `/api/led/status/raw` ในรอบถัดไปแล้วได้ค่า `"0,0,0,0,0,0"` → LED ดับทั้งหมดเอง

---

### 5.8 `POST /api/ingest`

| รายละเอียด | ค่า |
|-----------|-----|
| **ใครเรียก** | ESP32 (BLE bridge) หรือ Raspberry Pi |
| **Body** | `{ "device_code": "P1", "nearest_device": "AR", "rssi": -45, "zone_code": "AR" }` |
| **ทำอะไร** | รับข้อมูล BLE scan → broadcast ทันที → บันทึก DB |

> [!IMPORTANT]
> Endpoint นี้ใช้สำหรับ **Device Monitoring** ไม่เกี่ยวกับเกม

```typescript
.post('/api/ingest', async ({ body, server }) => {
    const { device_code, nearest_device, rssi, zone_code } = body;
    const isNearestValid = nearest_device !== "X";

    // 1. Broadcast ไป Frontend ก่อน (ไม่ต้องรอ DB)
    server?.publish('live-data', JSON.stringify(body));

    // 2. เขียน DB ทั้ง 3 tables พร้อมกัน (parallel)
    const [devicesResult, statusResult, historyResult] = await Promise.all([
      // Ensure device exists (upsert = insert ถ้าไม่มี, update ถ้ามีแล้ว)
      supabase.from('devices').upsert([{ device_code }]),

      // Update สถานะล่าสุด
      supabase.from('device_status').upsert([{
        device_code,
        nearest_device: isNearestValid ? nearest_device : null,
        latest_rssi: rssi
      }]),

      // Log ลง history
      supabase.from('device_history').insert([{
        device_code,
        nearest_device: isNearestValid ? nearest_device : null,
        rssi
      }])
    ]);

    // 3. ตรวจ error
    const errors = [devicesResult.error, statusResult.error, historyResult.error]
      .filter(Boolean);

    if (errors.length > 0) {
      return { success: false, errors: errors.map(e => e!.message) };
    }

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

**Design Decision — ทำไมถึง broadcast ก่อน DB:**
- เพราะ WebSocket broadcast เป็น in-memory operation → **instant** (< 1ms)
- DB write ต้องรอ network round-trip ไป Supabase → **ช้ากว่า** (50-200ms)
- ทำให้ Frontend ได้รับข้อมูล **ทันทีที่ device ส่งมา** โดยไม่ต้องรอ DB

---

## 6. WebSocket — Real-time Communication

### 6.1 Publish/Subscribe Model

Backend ใช้ระบบ **Pub/Sub** ผ่าน Elysia WebSocket:

```
Channel: "live-data"
```

ทุกครั้งที่มี event สำคัญ, backend จะ `server.publish('live-data', data)` ซึ่งจะส่งไปหา **ทุก client** ที่ subscribe อยู่

### 6.2 ประเภทของข้อมูลที่ส่งผ่าน WebSocket

#### Type 1: Game Update
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
- **ส่งเมื่อ:** game start, action, resolve battle, reset
- **Frontend แยกประเภทโดย:** `data.type === "game_update"`

#### Type 2: Device Ingest Data (Raw)
```json
{
  "device_code": "P1",
  "nearest_device": "AR",
  "rssi": -45,
  "zone_code": "AR"
}
```
- **ส่งเมื่อ:** `/api/ingest` ถูกเรียก
- **Frontend แยกประเภทโดย:** `data.device_code && data.nearest_device` (ไม่มี field `type`)

### 6.3 Flow Diagram: WebSocket

```
ESP32/RPi ──POST /api/ingest──► Backend ──publish('live-data')──► Frontend (Monitor)
                                                                      ▲
ESP32 ────POST /api/action───► Backend ──publish('live-data')──► Frontend (Game)
                                                                      │
Frontend ──POST /api/game/*──► Backend ──publish('live-data')─────────┘
```

---

## 7. Game Logic — gameLogic.ts

> ไฟล์: [`backend/src/gameLogic.ts`](file:///Users/nitisj/Workspace/Internship/Station/backend/src/gameLogic.ts)

### 7.1 State Machine

เกมทำงานเป็น **State Machine** มี 4 สถานะ:

```
                    ┌──────────────────────────────────────┐
                    │                                      │
                    ▼                                      │
              ┌──────────┐    startGame()    ┌──────────┐  │
              │  SETUP   │ ────────────────► │ PLAYING  │  │
              └──────────┘                   └─────┬────┘  │
                    ▲                              │       │
                    │ resetGame()          กดช่องศัตรู      │
                    │                              │       │
                    │                              ▼       │
              ┌──────────┐   resolveBattle() ┌──────────┐  │
              │GAME OVER │ ◄──── (turns=0)── │  BATTLE  │──┘
              └──────────┘                   └──────────┘
                    │                     resolves แล้วกลับ playing
                    │ startGame()
                    └──────────────────────────────────►  PLAYING
```

### 7.2 Properties ทั้งหมด

```typescript
export class GameLogic {
  state: GameState = 'setup';       // สถานะเกมปัจจุบัน
  currentPlayer: number = 1;        // ผู้เล่นที่กำลังเล่น (1 หรือ 2)
  turnsLeft: number = 10;           // จำนวนเทิร์นที่เหลือ
  turnPhase: number = 0;            // 0 = กดครั้งแรก, 1 = กดครั้งที่สอง (แต่ละเทิร์นกด 2 ครั้ง)
  matrix: number[][] = [[0,0,0],[0,0,0]];  // 2×3 matrix เก็บ owner ของแต่ละช่อง
  battleContext: { row, col } | null;      // ตำแหน่งที่กำลัง battle
  scores = { 1: 0, 2: 0 };                // คะแนนของแต่ละ player
}
```

### 7.3 เกม Matrix (2 แถว × 3 คอลัมน์)

```
         Col 0      Col 1      Col 2
Row 0  [ owner ]  [ owner ]  [ owner ]
Row 1  [ owner ]  [ owner ]  [ owner ]

owner = 0 → ว่าง
owner = 1 → Player 1 ครอบครอง
owner = 2 → Player 2 ครอบครอง
owner = 3 → กำลัง Battle (LED กะพริบ)
```

### 7.4 handleAction(row, col) — หัวใจของเกม

นี่คือ method ที่ถูกเรียกทุกครั้งที่ผู้เล่นกดปุ่ม:

```typescript
handleAction(row: number, col: number): boolean {
    if (this.state !== 'playing') return false;  // ไม่รับ action ถ้าไม่ได้อยู่ในสถานะ playing

    const currentOwner = this.matrix[row][col];

    // กฎ 1: ช่องว่าง → ยึดได้เลย
    if (currentOwner === 0) {
      this.matrix[row][col] = this.currentPlayer;
      this.finishTurn();
      return true;
    }

    // กฎ 2: ช่องศัตรู → เข้าสู่ Battle Mode
    if (currentOwner !== 0 && currentOwner !== this.currentPlayer && currentOwner !== 3) {
      this.state = 'battle';
      this.matrix[row][col] = 3;            // 3 = battle (LED กะพริบ)
      this.battleContext = { row, col };
      return true;
    }

    // กฎ 3: ช่องตัวเอง → Pass Turn (ข้ามเทิร์น)
    if (currentOwner === this.currentPlayer) {
      this.finishTurn();
      return true;
    }

    return false;
  }
```

**สรุป 3 กฎของเกม:**

| กด | สิ่งที่เกิดขึ้น |
|----|--------------|
| ช่องว่าง (`0`) | ยึดช่องนั้นเป็นของตัวเอง → จบ turn |
| ช่องศัตรู (`1` หรือ `2` ที่ไม่ใช่ตัวเอง) | เข้า Battle Mode → รอตัดสิน |
| ช่องตัวเอง | Pass Turn → ข้ามไปผู้เล่นอีกคน |

### 7.5 Turn System — ระบบเทิร์น

แต่ละ **เทิร์น** ประกอบด้วย **2 phases** (กดได้ 2 ครั้ง):

```typescript
private finishTurn() {
    if (this.turnPhase === 1) {
      // กดครั้งที่ 2 แล้ว → จบเทิร์น, ลด turnsLeft
      this.turnsLeft--;
      this.turnPhase = 0;
    } else {
      // กดครั้งแรก → เข้า phase 2
      this.turnPhase = 1;
    }

    if (this.turnsLeft <= 0) {
      // หมดเทิร์น → จบเกม
      this.state = 'game_over';
      this.calculateScores();
    } else {
      // สลับผู้เล่น
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }
  }
```

**ตัวอย่างลำดับการเล่น:**
```
Turn 10: P1 กด (phase 0→1) → P2 กด (phase 1→0, turnsLeft 10→9)
Turn  9: P1 กด (phase 0→1) → P2 กด (phase 1→0, turnsLeft 9→8)
...
Turn  1: P1 กด (phase 0→1) → P2 กด (phase 1→0, turnsLeft 1→0) → GAME OVER!
```

> [!WARNING]
> สังเกตว่า **ทุกครั้งที่กด** (ทั้ง phase 0 และ phase 1) จะ **สลับผู้เล่น** ดังนั้นแต่ละเทิร์นจริงๆ ผู้เล่นแต่ละคนจะกดได้ 1 ครั้ง

### 7.6 Battle Resolution

```typescript
resolveBattle(winner: number) {
    if (this.state !== 'battle' || !this.battleContext) return;

    const { row, col } = this.battleContext;
    this.matrix[row][col] = winner;   // ผู้ชนะได้ครอบครอง
    this.state = 'playing';           // กลับไป playing
    this.battleContext = null;

    this.finishTurn();                // นับเป็น 1 action ใน turn
  }
```

### 7.7 Score Calculation

```typescript
private calculateScores() {
    let p1 = 0, p2 = 0;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.matrix[r][c] === 1) p1++;
        if (this.matrix[r][c] === 2) p2++;
      }
    }
    this.scores = { 1: p1, 2: p2 };
  }
```

นับจำนวนช่องที่แต่ละผู้เล่นครอบครอง → ผู้ที่มีมากกว่าชนะ

### 7.8 getSnapshot() — ส่งสถานะไปให้ Frontend/ESP32

```typescript
getSnapshot() {
    return {
      state: this.state,
      currentPlayer: this.currentPlayer,
      turnsLeft: this.turnsLeft,
      matrix: this.matrix,
      battleContext: this.battleContext,
      scores: this.scores
    };
  }
```

---

## 8. Supabase Database

> ไฟล์ Schema: [`db/init.sql`](file:///Users/nitisj/Workspace/Internship/Station/db/init.sql)
> Supabase Client: [`backend/src/lib/supabase.ts`](file:///Users/nitisj/Workspace/Internship/Station/backend/src/lib/supabase.ts)

### 8.1 Supabase Client Setup

```typescript
// backend/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL    // https://xxx.supabase.co
const supabaseKey = process.env.SUPABASE_KEY    // service_role key

export const supabase = createClient(supabaseUrl, supabaseKey)
```

> [!CAUTION]
> Backend ใช้ **service_role key** (ไม่ใช่ anon key) เพราะต้อง bypass RLS (Row Level Security) เพื่อเขียนข้อมูลได้โดยตรง

### 8.2 Database Schema (3 Tables)

```
┌──────────────────┐     ┌───────────────────────┐     ┌─────────────────────────┐
│     devices       │     │    device_status       │     │    device_history        │
├──────────────────┤     ├───────────────────────┤     ├─────────────────────────┤
│ device_code (PK) │◄────│ device_code (PK, FK)  │     │ id (PK, auto)           │
│ created_at       │     │ nearest_device         │     │ device_code (FK)        │
└──────────────────┘     │ latest_rssi            │     │ nearest_device          │
                         │ last_seen              │     │ rssi                    │
                         └───────────────────────┘     │ recorded_at             │
                                                        └─────────────────────────┘
```

#### Table 1: `devices` — ทะเบียนอุปกรณ์
```sql
CREATE TABLE devices (
    device_code VARCHAR(10) PRIMARY KEY,    -- เช่น "P1", "P2"
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 2: `device_status` — สถานะล่าสุดของอุปกรณ์
```sql
CREATE TABLE device_status (
    device_code VARCHAR(10) PRIMARY KEY REFERENCES devices(device_code),
    nearest_device VARCHAR(10),              -- อุปกรณ์ที่ใกล้ที่สุด เช่น "AR"
    latest_rssi INTEGER,                     -- ค่าความแรงสัญญาณ
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Table 3: `device_history` — ประวัติการเคลื่อนไหว
```sql
CREATE TABLE device_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    device_code VARCHAR(10) NOT NULL REFERENCES devices(device_code),
    nearest_device VARCHAR(10),
    rssi INTEGER,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 8.3 Auto-Trim Trigger

DB มี trigger ที่จะ **ลบ record เก่า** เมื่อ history เกิน 1,100 rows → เหลือ 1,000 rows:

```sql
CREATE OR REPLACE FUNCTION trim_device_history()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COUNT(*) INTO row_count FROM device_history;
  IF row_count > 1100 THEN
    DELETE FROM device_history
    WHERE ctid IN (
      SELECT ctid FROM device_history
      ORDER BY recorded_at ASC
      LIMIT row_count - 1000
    );
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### 8.4 DB Operation Flow (ใน /api/ingest)

```
POST /api/ingest { device_code: "P1", nearest_device: "AR", rssi: -45 }
         │
         ├─► supabase.from('devices').upsert(...)         ← ลงทะเบียน device
         │                                                    (ถ้ามีอยู่แล้วก็ไม่ทำอะไร)
         │
         ├─► supabase.from('device_status').upsert(...)    ← อัปเดตสถานะล่าสุด
         │                                                    (overwrite ค่าเก่า)
         │
         └─► supabase.from('device_history').insert(...)   ← เพิ่ม log ใหม่
                                                              (append เข้า history)
         
         ⚡ ทั้ง 3 operations รันพร้อมกัน (Promise.all)
```

---

## 9. การเชื่อมต่อกับ Hardware

### 9.1 สถาปัตยกรรม Hardware (Game System)

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Arduino Button   │  I2C   │      ESP32        │  HTTP   │     Backend      │
│  (Slave 0x09)     │◄──────►│  (Master)         │◄──────►│  (Bun + Elysia)  │
│                   │        │                   │        │                   │
│  6 buttons        │        │  Core 0: HTTP     │        │  Game Logic       │
│  pins 2-7         │        │  Core 1: I2C scan │        │  WebSocket        │
│  debounce 15ms    │        │                   │        │                   │
└──────────────────┘         └───────┬──────────┘         └──────────────────┘
                                     │ I2C
                              ┌──────▼──────────┐
                              │  Arduino LED     │
                              │  (Slave 0x08)    │
                              │                  │
                              │  4×3 LED Matrix  │
                              │  Row scan        │
                              │  300ms blink     │
                              └──────────────────┘
```

### 9.2 ESP32 Game Controller — testESP32connectweb.ino

> ไฟล์: [`led.button/testESP32connectweb.ino`](file:///Users/nitisj/Workspace/Internship/Station/led.button/testESP32connectweb.ino)

ESP32 ทำงานแบบ **Dual-Core** เพื่อให้การอ่านปุ่มไม่ถูก block โดย HTTP:

| Core | หน้าที่ | Detail |
|------|---------|--------|
| **Core 1** (loop) | อ่านปุ่มจาก Arduino | I2C request ไปที่ 0x09 ทุก ~5ms (200 ครั้ง/วินาที) |
| **Core 0** (httpTask) | ส่ง HTTP ไป Backend | POST /api/action + GET /api/led/status/raw |

**การทำงานของ Core 1 (Button Scanning):**
```cpp
void loop() {
  // ล็อค I2C bus
  if (xSemaphoreTake(i2cMutex, pdMS_TO_TICKS(10))) {
    Wire.requestFrom(BUTTON_ARDUINO_ADDRESS, 1);  // ขอ 1 byte จาก Arduino Button
    if (Wire.available()) {
      byte btn = Wire.read();
      if (btn != 255) {                            // 255 = ไม่มีปุ่มถูกกด
        xQueueSend(buttonQueue, &btn, 0);          // ส่งเข้า queue (non-blocking)
      }
    }
    xSemaphoreGive(i2cMutex);
  }
  delay(5);  // Scan ~200 ครั้ง/วินาที
}
```

**การทำงานของ Core 0 (HTTP + LED Sync):**
```cpp
void httpTask(void *param) {
  while (true) {
    // 1. ตรวจ queue — ถ้ามีปุ่มถูกกด → POST /api/action
    byte btn;
    if (xQueueReceive(buttonQueue, &btn, 0) == pdTRUE) {
      // POST { "button_id": btn } → ได้ raw state กลับมา
      // ส่ง SYNC ไป LED Arduino ผ่าน I2C
    }

    // 2. Poll backend ทุก 1 วินาที → GET /api/led/status/raw
    if (millis() - lastSync > syncInterval) {
      // GET → ได้ "1,0,2,0,1,0" → ส่ง SYNC ไป LED Arduino
    }

    vTaskDelay(pdMS_TO_TICKS(10));
  }
}
```

**Shared Resources (FreeRTOS):**
- `buttonQueue` — Queue สำหรับส่ง button press จาก Core 1 → Core 0
- `i2cMutex` — Mutex ป้องกัน I2C bus ถูกใช้พร้อมกัน 2 cores
- `lastState` — Cache ป้องกันส่ง I2C ซ้ำถ้า state ไม่เปลี่ยน

### 9.3 Arduino Button — Button.ino

> ไฟล์: [`led.button/Button.ino`](file:///Users/nitisj/Workspace/Internship/Station/led.button/Button.ino)

- I2C Address: **0x09** (Slave)
- ปุ่ม 6 ตัว: pin 2-7, INPUT_PULLUP (กดแล้วเป็น LOW)
- Debounce: **15ms**
- เมื่อ ESP32 ร้องขอ (`Wire.requestFrom`) → ส่ง `selectedButton` (0-5) กลับ, แล้ว clear เป็น 255

### 9.4 Arduino LED — Arduino_LED.ino

> ไฟล์: [`led.button/Arduino_LED.ino`](file:///Users/nitisj/Workspace/Internship/Station/led.button/Arduino_LED.ino)

- I2C Address: **0x08** (Slave)
- LED Matrix: **4 แถว × 3 คอลัมน์** (Row scan multiplexing)
- รับ command `SYNC,o0,o1,o2,o3,o4,o5` จาก ESP32

**LED Matrix Physical Layout (4×3):**
```
         Col 0    Col 1    Col 2
Row 0  [P1 LED] [P1 LED] [P1 LED]   ← Player 1 LEDs (น้ำเงิน)
Row 1  [P1 LED] [P1 LED] [P1 LED]   ← Player 1 LEDs
Row 2  [P2 LED] [P2 LED] [P2 LED]   ← Player 2 LEDs (แดง)
Row 3  [P2 LED] [P2 LED] [P2 LED]   ← Player 2 LEDs
```

**Mapping จาก Game Matrix (2×3) → LED Matrix (4×3):**
```
Game [r][c] → LED Player 1: ledState[r][c]
            → LED Player 2: ledState[r+2][c]
```

| Game owner | Player 1 LED (row r) | Player 2 LED (row r+2) |
|-----------|---------------------|------------------------|
| `0` (ว่าง) | ดับ | ดับ |
| `1` (P1) | **ติด** | ดับ |
| `2` (P2) | ดับ | **ติด** |
| `3` (Battle) | **กะพริบ** | **กะพริบ** |

**Battle Blink:** ทุก 300ms สลับ `blinkState` → ถ้า `blinkState=true` ทั้ง P1 และ P2 LED ติด, ถ้า `false` ดับทั้งคู่

### 9.5 สถาปัตยกรรม Hardware (Monitoring System)

```
┌──────────────────┐    BLE Signal    ┌──────────────────┐    Serial/UART
│  Calliope Mini    │ ─────────────── │ Calliope Mini    │ ─────────────►
│  (Sender/Tag)     │   Broadcasting  │ (Receiver)       │   "P1,AR,-45"
│  ส่ง BLE beacon    │                │ สแกน BLE          │
└──────────────────┘                  └──────────────────┘
                                                               │
                                            ┌──────────────────▼─────┐
                                            │  ESP32 (BLE bridge)     │
                                            │  หรือ Raspberry Pi      │
                                            │                         │
                                            │  Parse: "P1,AR,-45"    │
                                            │  POST /api/ingest       │
                                            └─────────────────────────┘
```

**Raspberry Pi Script** ([`Rpi/rpi_data.py`](file:///Users/nitisj/Workspace/Internship/Station/Rpi/rpi_data.py)):
- อ่าน Serial จาก Calliope: `P1,AR,-45`
- Parse เป็น JSON: `{ device_code: "P1", nearest_device: "AR", rssi: -45 }`
- POST ไปที่ `http://<backend-ip>:3000/api/ingest`

**ESP32 BLE Bridge** ([`ESP32/esp32.cpp`](file:///Users/nitisj/Workspace/Internship/Station/ESP32/esp32.cpp)):
- ทำหน้าที่เหมือน RPi แต่เป็น ESP32
- อ่าน Serial2 จาก Calliope → Parse → POST /api/ingest

---

## 10. การเชื่อมต่อกับ Frontend

### 10.1 Frontend เรียก Backend อย่างไร

Frontend (React + Vite) เชื่อมกับ Backend ผ่าน **2 ช่องทาง:**

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                                                              │
│  ┌──────────────┐     ┌──────────────┐    ┌──────────────┐  │
│  │   Game.tsx    │     │  Monitor.tsx │    │   Live.tsx   │  │
│  └──────┬───────┘     └──────┬───────┘    └──────┬───────┘  │
│         │                    │                    │          │
│    ┌────▼────────────────────▼────────────────────▼────┐     │
│    │            Channel 1: REST API (HTTP)             │     │
│    │  fetch("/api/game/status")   → initial load       │     │
│    │  fetch("/api/game/start")    → start game         │     │
│    │  fetch("/api/action")        → simulate button    │     │
│    │  fetch("/api/game/resolve")  → battle winner      │     │
│    │  fetch("/api/game/reset")    → restart             │     │
│    └──────────────────────────────────────────────────┘     │
│                                                              │
│    ┌──────────────────────────────────────────────────┐     │
│    │         Channel 2: WebSocket (Real-time)          │     │
│    │  ws://<host>/ws → subscribe 'live-data'           │     │
│    │                                                    │     │
│    │  รับ: { type: "game_update", game: {...} }         │     │
│    │  รับ: { device_code, nearest_device, rssi }        │     │
│    └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Game.tsx — Frontend ฝั่งเกม

> ไฟล์: [`frontend/src/pages/Game.tsx`](file:///Users/nitisj/Workspace/Internship/Station/frontend/src/pages/Game.tsx)

**Initialization (ตอน page load):**
```typescript
// ดึงสถานะเกมปัจจุบันจาก Backend
useEffect(() => {
    fetch("/api/game/status")
      .then(res => res.json())
      .then(data => setGame(data.game));
  }, []);
```

**WebSocket Listener:**
```typescript
useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}/ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Game update จาก /api/action, /api/game/start, etc.
      if (data.type === "game_update" && data.game) {
        setGame(data.game);
      }

      // Device movement (จาก /api/ingest) → เล่นเสียงตาม zone
      if (data.device_code && data.nearest_device) {
        // อัปเดต latestZones สำหรับ AudioEngine
      }
    };

    return () => ws.close();
  }, []);
```

**User Actions → API Calls:**
```typescript
// กดปุ่ม Start
const handleStart = (player) => fetch("/api/game/start", {
  method: "POST",
  body: JSON.stringify({ startingPlayer: player })
});

// กดช่องบน Matrix (จำลองปุ่มบนเว็บ)
const handleAction = (row, col) => {
  const button_id = row * 3 + col;  // แปลง row,col → button_id
  fetch("/api/action", {
    method: "POST",
    body: JSON.stringify({ button_id })
  });
};

// ตัดสิน Battle
const handleResolve = (winner) => fetch("/api/game/resolve", {
  method: "POST",
  body: JSON.stringify({ winner })
});

// Reset เกม
const handleReset = () => fetch("/api/game/reset", { method: "POST" });
```

### 10.3 Monitor.tsx — Frontend ฝั่ง Monitoring

> ไฟล์: [`frontend/src/pages/Monitor.tsx`](file:///Users/nitisj/Workspace/Internship/Station/frontend/src/pages/Monitor.tsx)

**Initialization:**
- ดึง history จาก Supabase **โดยตรง** (ไม่ผ่าน Backend):
```typescript
const { data } = await supabase
    .from("device_history")
    .select("*")
    .order("id", { ascending: false });
```

**Real-time Updates:**
- ฟัง WebSocket เหมือน Game.tsx แต่รับข้อมูล device ingest:
```typescript
ws.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    setLatestByDevice(prev => ({ ...prev, [newData.device_code]: newData }));
    setStream(prev => [newData, ...prev]);
};
```

> [!NOTE]
> Monitor.tsx มีการเชื่อมต่อ Supabase **โดยตรงจาก Frontend** (ใช้ anon key) สำหรับดึง history ครั้งแรก แต่ real-time updates มาจาก WebSocket ของ Backend

### 10.4 Vite Proxy Configuration

Frontend ใช้ Vite dev server ที่ port 5173, Backend อยู่ที่ port 3000. การเรียก API จาก Frontend ใช้ relative path (`/api/...`) ซึ่ง Vite จะ proxy ไปให้ Backend:

```
Frontend (5173)  →  /api/*  →  proxy to  →  Backend (3000)
Frontend (5173)  →  /ws     →  proxy to  →  Backend (3000)
```

---

## 11. Docker & Deployment

### 11.1 Docker Compose

> ไฟล์: [`docker-compose.yml`](file:///Users/nitisj/Workspace/Internship/Station/docker-compose.yml)

```yaml
services:
  backend:
    build: ./backend
    ports: ["3000:3000"]
    env_file: ./backend/.env
    volumes:
      - ./backend:/app           # Hot-reload: แก้โค้ดแล้วเห็นผลทันที
      - /app/node_modules        # ไม่ให้ local node_modules ทับ container
    command: bun run dev          # รันด้วย --watch
    networks: [app-network]

  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on: [backend]         # รอ backend start ก่อน
    networks: [app-network]

networks:
  app-network:
    driver: bridge                # ทั้ง 2 container อยู่ network เดียวกัน
```

### 11.2 Backend Dockerfile

> ไฟล์: [`backend/Dockerfile`](file:///Users/nitisj/Workspace/Internship/Station/backend/Dockerfile)

```dockerfile
FROM oven/bun:1          # ใช้ Bun official image
WORKDIR /app
COPY package.json bun.lock* bun.lockb* ./
RUN bun install
COPY . .
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
```

---

## 12. Data Flow Diagrams

### 12.1 Flow: ผู้เล่นกดปุ่ม (Game)

```
กดปุ่มจริง
    │
    ▼
Arduino Button (0x09) ──scanButtons()──► selectedButton = 2
    │
    │  I2C requestFrom
    ▼
ESP32 Core 1 (loop) ──xQueueSend──► buttonQueue
    │
    ▼
ESP32 Core 0 (httpTask)
    │
    │  POST /api/action { button_id: 2 }
    ▼
Backend (index.ts)
    │
    ├─► game.handleAction(0, 2)
    │       │
    │       ├─► matrix[0][2] = 1  (Player 1 ยึด)
    │       └─► finishTurn()
    │
    ├─► server.publish('live-data', { type: 'game_update', game: {...} })
    │       │
    │       └──► Frontend (Game.tsx) ──setGame()──► UI อัปเดต
    │
    └─► return "1,0,1,0,0,0"  (ส่งกลับ ESP32)
            │
            ▼
        ESP32 ──I2C SYNC──► Arduino LED (0x08)
            │
            ▼
        LED Matrix แสดงผล:
        [🔵][  ][🔵]
        [  ][  ][  ]
```

### 12.2 Flow: Device Movement (Monitoring)

```
Calliope Mini (Tag) ──BLE broadcast──►  Calliope Mini (Receiver)
                                            │
                                            │ UART Serial: "P1,AR,-45"
                                            ▼
                                      RPi / ESP32 (Bridge)
                                            │
                                            │ POST /api/ingest
                                            │ { device_code:"P1", nearest_device:"AR", rssi:-45 }
                                            ▼
                                      Backend (index.ts)
                                            │
                                ┌───────────┼───────────┐
                                │           │           │
                                ▼           ▼           ▼
                          WS Broadcast   DB upsert   DB insert
                          (instant)      devices     history
                          (< 1ms)        status      (append)
                                │
                                ▼
                          Frontend (Monitor.tsx)
                                │
                                ├─► แสดง Latest Packet
                                ├─► อัปเดต History List
                                └─► เล่นเสียงตาม zone (AudioEngine)
```

### 12.3 Flow: Battle Sequence

```
P1 กดช่องของ P2             Backend                         Frontend
      │                        │                               │
      │ POST /api/action       │                               │
      │ { button_id: 4 }       │                               │
      ├───────────────────────►│                               │
      │                        │ handleAction(1,1)             │
      │                        │ matrix[1][1] = 3 (battle)     │
      │                        │ state = 'battle'              │
      │                        │                               │
      │                        │──WS: game_update──────────────►
      │                        │                               │ แสดง Battle Modal
      │                        │                               │ (ทั้ง 2 LED กะพริบ)
      │                        │                               │
      │                        │    ผู้ตัดสินกดปุ่ม "P1 Wins"    │
      │                        │◄─POST /api/game/resolve───────│
      │                        │  { winner: 1 }                │
      │                        │                               │
      │                        │ resolveBattle(1)              │
      │                        │ matrix[1][1] = 1              │
      │                        │ state = 'playing'             │
      │                        │                               │
      │                        │──WS: game_update──────────────►
      │                        │                               │ ปิด Modal
      │                        │                               │ LED P1 ติด
```

---

## สรุป: อะไรเชื่อมอะไร

| จาก | ไป | ช่องทาง | ข้อมูล |
|-----|-----|---------|--------|
| Arduino Button | ESP32 | I2C (0x09) | button id (0-5) |
| ESP32 | Backend | HTTP POST `/api/action` | `{ button_id }` |
| Backend | ESP32 | HTTP Response | `"1,0,2,0,1,0"` |
| ESP32 | Arduino LED | I2C (0x08) | `"SYNC,1,0,2,0,1,0"` |
| Backend | Frontend | WebSocket `live-data` | `{ type: "game_update", game }` |
| Frontend | Backend | HTTP POST | `/api/game/start`, `/resolve`, `/reset` |
| Calliope | RPi/ESP32 | Serial UART | `"P1,AR,-45"` |
| RPi/ESP32 | Backend | HTTP POST `/api/ingest` | `{ device_code, nearest_device, rssi }` |
| Backend | Supabase | Supabase JS Client | upsert/insert |
| Backend | Frontend | WebSocket `live-data` | raw ingest data |
| Frontend | Supabase | Supabase JS Client (direct) | SELECT history |

---

> 📝 **เอกสารนี้สร้างเมื่อ:** 2026-07-20
> **อ้างอิงจากโค้ด version:** package.json `1.0.50`
