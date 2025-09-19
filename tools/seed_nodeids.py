
import os, time, random, yaml
from datetime import datetime, timedelta, timezone
import psycopg2
from psycopg2.extras import execute_batch, Json

DB = os.getenv("DATABASE_URL", "postgresql://tsdb:tsdb@localhost:5432/tsdb")
CONFIG = os.getenv("CONFIG_PATH", "./collector_config.yaml")
SAMPLES_PER_SENSOR = int(os.getenv("SAMPLES_PER_SENSOR", "1000"))

def load_config(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def gen_series(sensor, start_ts):
    mn, mx = float(sensor.get("min", 0)), float(sensor.get("max", 100))
    vals = []
    ts = start_ts
    base = (mn + mx) / 2.0
    amp = (mx - mn) / 2.5
    for i in range(SAMPLES_PER_SENSOR):
        val = max(mn, min(mx, base + amp * random.uniform(-0.9, 0.9)))
        vals.append((ts, val, 192))
        ts += timedelta(seconds=1)
    return vals

def main():
    cfg = load_config(CONFIG)
    sensors = cfg.get("opcua", {}).get("sensors", [])
    if not sensors:
        print("No sensors in config."); return

    print(f"Seeding {len(sensors)} sensors and {SAMPLES_PER_SENSOR} samples each...")
    conn = psycopg2.connect(DB)
    conn.autocommit = True
    cur = conn.cursor()

    # Insert sensors if not exists and map ids
    tag_to_id = {}
    for s in sensors:
        cur.execute(
            "INSERT INTO sensors(tag, unit, source) VALUES (%s,%s,%s) ON CONFLICT (tag) DO UPDATE SET unit=EXCLUDED.unit RETURNING id",
            (s["tag"], s["unit"], Json({"type": "opcua", "nodeId": s["nodeId"]}))
        )
        tag_to_id[s["tag"]] = cur.fetchone()[0]

    # Generate and insert measurements
    start_ts = datetime.now(timezone.utc) - timedelta(seconds=SAMPLES_PER_SENSOR)
    batch = []
    for s in sensors:
        sid = tag_to_id[s["tag"]]
        series = gen_series(s, start_ts)
        for ts, val, q in series:
            batch.append((ts, sid, val, q))

    print(f"Inserting {len(batch)} rows into measurements...")
    execute_batch(cur, "INSERT INTO measurements (ts, sensor_id, value, quality) VALUES (%s,%s,%s,%s)", batch, page_size=5000)
    cur.close(); conn.close()
    print("Seeding completed.")

if __name__ == "__main__":
    main()
