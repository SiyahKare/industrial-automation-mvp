import asyncpg
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request

router = APIRouter(prefix="/api/measurements", tags=["measurements"])

async def get_pool_dep(request: Request) -> asyncpg.Pool:
    return request.app.state.pool

def parse_time(val: Optional[str], default: datetime) -> datetime:
    if not val:
        return default
    v = val.strip().lower()
    if v == "now":
        return datetime.now(timezone.utc)
    if v.startswith("-"):
        num = int(v[1:-1])
        unit = v[-1]
        delta = {"s": timedelta(seconds=num), "m": timedelta(minutes=num), "h": timedelta(hours=num), "d": timedelta(days=num)}.get(unit)
        if not delta:
            raise HTTPException(400, "invalid relative time")
        return datetime.now(timezone.utc) - delta
    try:
        return datetime.fromisoformat(val.replace("Z", "+00:00"))
    except Exception:
        raise HTTPException(400, "invalid timestamp format")

@router.get("")
async def list_measurements(
    tag: Optional[str] = Query(None, description="Filter by sensor tag"),
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=10000),
    pool: asyncpg.Pool = Depends(get_pool_dep),
):
    ts_end = parse_time(end, datetime.now(timezone.utc))
    ts_start = parse_time(start, ts_end - timedelta(hours=1))
    if ts_start >= ts_end:
        raise HTTPException(400, "start must be before end")

    sql = [
        "SELECT m.ts, s.tag, m.value FROM measurements m JOIN sensors s ON s.id=m.sensor_id",
        "WHERE m.ts >= $1 AND m.ts <= $2",
    ]
    params = [ts_start, ts_end]
    if tag:
        sql.append("AND s.tag = $3")
        params.append(tag)
        limit_placeholder = "$4"
    else:
        limit_placeholder = "$3"
    sql.append(f"ORDER BY m.ts DESC LIMIT {limit_placeholder}")
    params.append(limit)
    q = " ".join(sql)

    async with pool.acquire() as con:
        rows = await con.fetch(q, *params)
    return [
        {"ts": r["ts"].isoformat(), "tag": r["tag"], "value": float(r["value"]) if r["value"] is not None else None}
        for r in rows
    ]

@router.get("/stats")
async def measurements_stats(
    tag: str = Query(...),
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
    pool: asyncpg.Pool = Depends(get_pool_dep),
):
    ts_end = parse_time(end, datetime.now(timezone.utc))
    ts_start = parse_time(start, ts_end - timedelta(hours=1))
    if ts_start >= ts_end:
        raise HTTPException(400, "start must be before end")

    sql = (
        "SELECT count(*) AS n, min(value) AS min, max(value) AS max, avg(value) AS avg "
        "FROM measurements m JOIN sensors s ON s.id=m.sensor_id "
        "WHERE s.tag=$1 AND m.ts >= $2 AND m.ts <= $3"
    )
    async with pool.acquire() as con:
        row = await con.fetchrow(sql, tag, ts_start, ts_end)
    return {
        "tag": tag,
        "start": ts_start.isoformat(),
        "end": ts_end.isoformat(),
        "count": int(row["n"]) if row and row["n"] is not None else 0,
        "min": float(row["min"]) if row and row["min"] is not None else None,
        "max": float(row["max"]) if row and row["max"] is not None else None,
        "avg": float(row["avg"]) if row and row["avg"] is not None else None,
    }


