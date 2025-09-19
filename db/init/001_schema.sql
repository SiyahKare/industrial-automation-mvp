
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS sensors (
  id SERIAL PRIMARY KEY,
  tag TEXT UNIQUE NOT NULL,
  unit TEXT NOT NULL,
  source JSONB
);
CREATE TABLE IF NOT EXISTS measurements (
  ts TIMESTAMPTZ NOT NULL,
  sensor_id INT NOT NULL REFERENCES sensors(id),
  value DOUBLE PRECISION NOT NULL,
  quality SMALLINT NOT NULL DEFAULT 192
);
SELECT create_hypertable('measurements', 'ts', if_not_exists => TRUE, chunk_time_interval => INTERVAL '1 day');
ALTER TABLE measurements SET (timescaledb.compress, timescaledb.compress_segmentby='sensor_id');
-- Optional: add compression policy (commented if image version lacks policy function idempotency)
SELECT add_compression_policy('measurements', INTERVAL '30 days');
INSERT INTO sensors(tag, unit, source) VALUES
  ('L1/Power_kW','kW','{"type":"sim"}'),
  ('Water/Flow_m3h','m3/h','{"type":"sim"}')
ON CONFLICT DO NOTHING;
