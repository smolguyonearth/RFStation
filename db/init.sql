CREATE TABLE devices (
    device_code VARCHAR(10) PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE device_status (
    device_code VARCHAR(10) PRIMARY KEY REFERENCES devices(device_code) ON DELETE CASCADE,
    zone_code VARCHAR(10) NOT NULL,
    nearest_device VARCHAR(10) REFERENCES devices(device_code) ON DELETE SET NULL,
    latest_rssi INTEGER,
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE device_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    device_code VARCHAR(10) NOT NULL REFERENCES devices(device_code) ON DELETE CASCADE,
    zone_code VARCHAR(10) NOT NULL,
    nearest_device VARCHAR(10) REFERENCES devices(device_code) ON DELETE SET NULL,
    rssi INTEGER,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_history_device ON device_history(device_code);
CREATE INDEX idx_history_zone ON device_history(zone_code);
CREATE INDEX idx_history_time ON device_history(recorded_at DESC);
CREATE INDEX idx_history_device_time ON device_history(device_code, recorded_at DESC);

-- Function to keep only the latest 1000 records in device_history
CREATE OR REPLACE FUNCTION trim_device_history()
RETURNS TRIGGER AS $$
DECLARE
  row_count BIGINT;
BEGIN
  -- Quick count check — skip if under limit
  SELECT COUNT(*) INTO row_count FROM device_history;

  -- Only trim when 10% over limit (avoids trimming on every insert)
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

-- Trigger to run the trim function after every insert
CREATE OR REPLACE TRIGGER trg_trim_device_history
AFTER INSERT ON device_history
FOR EACH STATEMENT
EXECUTE FUNCTION trim_device_history();