
import os, time, random, yaml
import msgpack
from paho.mqtt import client as mqtt

MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
TOPIC = "plant/telemetry"
CONFIG_PATH = os.getenv("COLLECTOR_CONFIG", "/app/config.yaml")

def load_config(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def simulate_value(sensor: dict, t: float) -> float:
    typ = sensor.get("type")
    mn, mx = float(sensor.get("min", 0)), float(sensor.get("max", 100))
    base = (mn + mx) / 2.0
    amp = (mx - mn) / 2.5
    # simple smooth variation
    return max(mn, min(mx, base + amp * random.uniform(-0.8, 0.8)))

def main():
    cfg = load_config(CONFIG_PATH)
    sensors = cfg.get("opcua", {}).get("sensors", [])
    c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    c.connect(MQTT_HOST, MQTT_PORT, 60)
    c.loop_start()
    print(f"[collector] loaded {len(sensors)} sensors from {CONFIG_PATH}. publishing @1Hz to {MQTT_HOST}:{MQTT_PORT}")
    while True:
        ts = time.time()
        for s in sensors:
            rec = {"ts": ts, "tag": s["tag"], "value": simulate_value(s, ts), "q": 192, "meta": {"nodeId": s["nodeId"], "unit": s["unit"]}}
            c.publish(TOPIC, payload=msgpack.dumps(rec), qos=1)
        time.sleep(1.0)

if __name__ == "__main__":
    main()
