CREATE TABLE devices (
    device_code VARCHAR(10) PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE device_status (
    device_code VARCHAR(10) PRIMARY KEY
        REFERENCES devices(device_code)
        ON DELETE CASCADE,

    nearest_device VARCHAR(10),

    latest_rssi INTEGER,

    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE device_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    device_code VARCHAR(10) NOT NULL
        REFERENCES devices(device_code)
        ON DELETE CASCADE,

    nearest_device VARCHAR(10),

    rssi INTEGER,

    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX idx_history_device
ON device_history(device_code);


CREATE INDEX idx_history_zone
ON device_history(nearest_device);


CREATE INDEX idx_history_time
ON device_history(recorded_at DESC);


CREATE INDEX idx_history_device_time
ON device_history(device_code, recorded_at DESC);



-- Keep latest 1000 records
CREATE OR REPLACE FUNCTION trim_device_history()
RETURNS TRIGGER AS $$
DECLARE
  row_count BIGINT;
BEGIN

  SELECT COUNT(*) INTO row_count
  FROM device_history;


  IF row_count > 1100 THEN

    DELETE FROM device_history
    WHERE ctid IN (

      SELECT ctid
      FROM device_history
      ORDER BY recorded_at ASC
      LIMIT row_count - 1000

    );

  END IF;


  RETURN NULL;

END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER trg_trim_device_history

AFTER INSERT ON device_history

FOR EACH STATEMENT

EXECUTE FUNCTION trim_device_history();