import { Elysia, t } from 'elysia'
// [DB DISABLED] Database is disabled. To re-enable, see docs/DB_ACTIVATE.md
// import { supabase } from './lib/supabase'
import { GameLogic } from './gameLogic'

const game = new GameLogic()
let packageCounter = 0;

const app = new Elysia()
  .ws('/ws', {
    open(ws) {
      ws.subscribe('live-data')
      console.log('Frontend connected to WebSocket')
    }
  })
  // --- Game Endpoints ---
  .get('/api/game/status', () => {
    return { success: true, game: game.getSnapshot() };
  })
  .get('/api/led/status/raw', () => {
    // Returns comma separated string: row0col0,row0col1...
    return game.matrix.flat().join(',');
  })
  .post('/api/game/start', ({ body, server }) => {
    game.startGame(body.startingPlayer);
    server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
    return { success: true };
  }, {
    body: t.Object({
      startingPlayer: t.Number()
    })
  })
  .post('/api/controller/start', ({ body, server }) => {
    game.startGame(body.startingPlayer);
    server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
    return { success: true };
  }, {
    body: t.Object({
      startingPlayer: t.Number()
    })
  })
  .post('/api/controller/mode', ({ body, server }) => {
    game.setMode(body.mode as any, body.language as any);
    server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
    return { success: true };
  }, {
    body: t.Object({
      mode: t.String(),
      language: t.Optional(t.String())
    })
  })
  .post('/api/mode', ({ body, server }) => {
    game.setMode(body.mode as any);
    server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
    return { success: true };
  }, {
    body: t.Object({
      mode: t.String()
    })
  })
  .post('/api/controller/endturn', ({ server }) => {
    const changed = game.endTurn();
    if (changed) {
      server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
    }
    return { success: true };
  })
  .post('/api/game/resolve', ({ body, server }) => {
    game.resolveBattle(body.winner);
    server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
    return { success: true };
  }, {
    body: t.Object({
      winner: t.Number()
    })
  })
  .post('/api/game/reset', ({ server }) => {
    game.resetGame();
    server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
    // Tell ESP32 to clear via websocket event? ESP32 only polls /api/led/status/raw!
    // That's fine, ESP32 will pick up the 0,0,0,0,0,0 on next poll.
    return { success: true };
  })
  .post('/api/game/skip-intro', ({ server }) => {
    game.introActive = false;
    server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
    return { success: true };
  })
  .post('/api/action', ({ body, server }) => {
    const { button_id } = body;

    // Map button_id (0-5) to row/col
    if (button_id >= 0 && button_id < 6) {
      const row = Math.floor(button_id / 3);
      const col = button_id % 3;

      console.log(`🔘 Button pressed: ${button_id} (Place [${row},${col}])`);

      // Pass to game logic
      const changed = game.handleAction(row, col);
      console.log(`[Backend API] handleAction returned changed=${changed}`);

      if (changed) {
        // Broadcast to frontend
        server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
      }

      // Always return raw state back to ESP32 for instant sync
      return game.matrix.flat().join(',');
    }

    // Special: button_id < 0 means "close / deselect" (e.g. Museum X button)
    if (button_id < 0) {
      const changed = game.handleAction(-1, -1);
      if (changed) {
        server?.publish('live-data', JSON.stringify({ type: 'game_update', game: game.getSnapshot() }));
      }
      return "OK";
    }

    return "INVALID";
  }, {
    body: t.Object({
      button_id: t.Number()
    })
  })
  // --- Ingest Endpoint (Pass-through: receive → broadcast → done) ---
  .post('/api/ingest', ({ body, server }) => {
    // Broadcast to all connected frontends via WebSocket (instant, in-memory)
    server?.publish('live-data', JSON.stringify(body));

    packageCounter++;
    if (packageCounter % 10 === 0) {
      console.log(`[Backend] Received ${packageCounter} packages from Calliope beacons (Last: ${body.device_code} at ${body.zone_code})`);
    }

    // [DB DISABLED] Database writes are disabled.
    // To re-enable persistent storage, see docs/DB_ACTIVATE.md
    // --- Original DB code below ---
    // const { device_code, nearest_device, rssi, zone_code } = body;
    // const isNearestValid = nearest_device !== "X";
    //
    // const [devicesResult, statusResult, historyResult] = await Promise.all([
    //   supabase.from('devices').upsert([{ device_code }]),
    //   supabase.from('device_status').upsert([{
    //     device_code,
    //     nearest_device: isNearestValid ? nearest_device : null,
    //     latest_rssi: rssi
    //   }]),
    //   supabase.from('device_history').insert([{
    //     device_code,
    //     nearest_device: isNearestValid ? nearest_device : null, rssi
    //   }])
    // ]);
    //
    // const errors = [devicesResult.error, statusResult.error, historyResult.error].filter(Boolean);
    // if (errors.length > 0) {
    //   errors.forEach(e => console.error('❌ DB error:', e!.message));
    //   return { success: false, errors: errors.map(e => e!.message) };
    // }

    return { success: true }
  }, {
    body: t.Object({
      device_code: t.String(),
      nearest_device: t.String(),
      rssi: t.Number(),
      zone_code: t.Optional(t.String())
    })
  })
  .listen({ port: 3000, hostname: '0.0.0.0' })

console.log(`Backend running at http://${app.server?.hostname}:${app.server?.port}`)