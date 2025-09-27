from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Literal, List
import asyncpg, json

router = APIRouter(prefix="/api/sensors", tags=["sensors"])


class Source(BaseModel):
    type: Literal["opcua", "modbus", "sim"]
    nodeId: str | None = None
    address: str | None = None


class SensorIn(BaseModel):
    tag: str = Field(min_length=2)
    unit: str
    source: Source


@router.post("", status_code=201)
async def upsert_sensor(s: SensorIn, request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as con:
        row = await con.fetchrow(
            "SELECT * FROM sensor_upsert($1,$2,$3::jsonb)",
            s.tag,
            s.unit,
            json.dumps(s.source.model_dump()),
        )
    return dict(row)


@router.post("/bulk", status_code=201)
async def upsert_bulk(items: List[SensorIn], request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as con:
        async with con.transaction():
            out = []
            for s in items:
                row = await con.fetchrow(
                    "SELECT * FROM sensor_upsert($1,$2,$3::jsonb)",
                    s.tag,
                    s.unit,
                    json.dumps(s.source.model_dump()),
                )
                out.append(dict(row))
    return out


@router.get("")
async def list_sensors(request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as con:
        rows = await con.fetch("SELECT id, tag, unit, source FROM sensors ORDER BY tag ASC")
    out = []
    for r in rows:
        rec = dict(r)
        if isinstance(rec.get("source"), str):
            try:
                rec["source"] = json.loads(rec["source"])
            except Exception:
                pass
        out.append(rec)
    return out


