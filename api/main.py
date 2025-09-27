
import os, asyncio, time
from typing import List
import asyncpg
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from pipelines import router as pipelines_router
from series import router as series_router
from sensors import router as sensors_router
from executions import router as executions_router
from measurements import router as measurements_router

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://tsdb:tsdb@localhost:5432/tsdb")
app = FastAPI(title="Industrial Automation API")

class Sensor(BaseModel):
    id: int
    tag: str
    unit: str

async def get_pool():
    if not hasattr(app.state, "pool"):
        app.state.pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)
    return app.state.pool

@app.on_event("startup")
async def startup():
    if not hasattr(app.state, "pool"):
        app.state.pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)

@app.on_event("shutdown")
async def shutdown():
    if hasattr(app.state, "pool"):
        await app.state.pool.close()

@app.get("/health")
async def health():
    return {"ok": True, "ts": time.time()}

@app.get("/api/sensors", response_model=List[Sensor])
async def sensors():
    pool = await get_pool()
    async with pool.acquire() as con:
        rows = await con.fetch("SELECT id, tag, unit FROM sensors ORDER BY id")
    return [Sensor(**dict(r)) for r in rows]

app.include_router(pipelines_router)
app.include_router(series_router)
app.include_router(sensors_router)
app.include_router(executions_router)
app.include_router(measurements_router)

@app.websocket("/ws/stream")
async def ws(ws: WebSocket):
    await ws.accept()
    pool = await get_pool()
    try:
        while True:
            async with pool.acquire() as con:
                rows = await con.fetch("""
                  SELECT s.tag, m.value FROM sensors s
                  JOIN LATERAL (
                    SELECT value FROM measurements m WHERE m.sensor_id=s.id ORDER BY ts DESC LIMIT 1
                  ) m ON TRUE
                """)
            values = {r["tag"]: r["value"] for r in rows}
            out = {"OUT": {"value": sum(values.values()), "unit": "demo"}}
            await ws.send_json({"ts": time.time(), "nodes": out})
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        return
