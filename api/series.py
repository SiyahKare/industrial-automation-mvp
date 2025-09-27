import asyncpg
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Literal, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request

router = APIRouter(prefix="/api/series", tags=["series"])


async def get_pool_dep(request: Request) -> asyncpg.Pool:
    return request.app.state.pool


def parse_bucket_seconds(bucket: str) -> int:
    b = bucket.strip().lower()
    if b.endswith("ms"):
        n = int(b[:-2])
        return max(1, n // 1000)
    if b.endswith("s"):
        return int(b[:-1])
    if b.endswith("m"):
        return int(b[:-1]) * 60
    if b.endswith("h"):
        return int(b[:-1]) * 3600
    if b.endswith("d"):
        return int(b[:-1]) * 86400
    # default: seconds
    return int(b)


@router.get("")
async def get_series(
    tags: str = Query(..., description="Comma-separated sensor tags"),
    start: Optional[str] = Query(None, description="ISO timestamp or relative like -1h"),
    end: Optional[str] = Query(None, description="ISO timestamp or relative like now"),
    bucket: str = Query("1m", description="Resolution, e.g. 10s, 1m, 5m, 1h"),
    agg: Literal["avg", "min", "max", "sum"] = Query("avg"),
    pool: asyncpg.Pool = Depends(get_pool_dep),
):
    if not tags:
        raise HTTPException(400, "tags is required")

    # time range parsing
    def parse_time(val: Optional[str], default: datetime) -> datetime:
        if not val:
            return default
        v = val.strip().lower()
        if v == "now":
            return datetime.now(timezone.utc)
        if v.startswith("-"):
            num = int(v[1:-1])
            unit = v[-1]
            delta = {
                "s": timedelta(seconds=num),
                "m": timedelta(minutes=num),
                "h": timedelta(hours=num),
                "d": timedelta(days=num),
            }.get(unit)
            if not delta:
                raise HTTPException(400, "invalid relative time")
            return datetime.now(timezone.utc) - delta
        try:
            # attempt ISO 8601
            return datetime.fromisoformat(val.replace("Z", "+00:00"))
        except Exception:
            raise HTTPException(400, "invalid timestamp format")

    ts_end = parse_time(end, datetime.now(timezone.utc))
    ts_start = parse_time(start, ts_end - timedelta(hours=1))
    if ts_start >= ts_end:
        raise HTTPException(400, "start must be before end")

    bucket_secs = max(1, parse_bucket_seconds(bucket))
    tag_list = [t for t in (x.strip() for x in tags.split(",")) if t]
    if not tag_list:
        raise HTTPException(400, "no valid tags provided")

    agg_sql = {"avg": "avg", "min": "min", "max": "max", "sum": "sum"}[agg]

    sql = f"""
        WITH sel AS (
            SELECT id, tag FROM sensors WHERE tag = ANY($1::text[])
        )
        SELECT time_bucket($2::interval, m.ts) AS bucket,
               s.tag,
               {agg_sql}(m.value) AS value
        FROM measurements m
        JOIN sel s ON s.id = m.sensor_id
        WHERE m.ts >= $3 AND m.ts <= $4
        GROUP BY bucket, s.tag
        ORDER BY bucket ASC
    """

    async with pool.acquire() as con:
        rows = await con.fetch(sql, tag_list, timedelta(seconds=bucket_secs), ts_start, ts_end)

    # shape: { tag: [{t, v}, ...] }
    out: Dict[str, List[Dict[str, float]]] = {}
    for r in rows:
        tag = r["tag"]
        out.setdefault(tag, []).append({"t": r["bucket"].isoformat(), "v": float(r["value"])})
    return {
        "series": out,
        "start": ts_start.isoformat(),
        "end": ts_end.isoformat(),
        "bucket": f"{bucket_secs} seconds",
        "agg": agg,
    }


