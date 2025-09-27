from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from pydantic import BaseModel
import asyncpg, json, asyncio
from uuid import UUID

router = APIRouter(prefix="/api/executions", tags=["executions"])

async def get_pool(request: Request) -> asyncpg.Pool:
    return request.app.state.pool

class ExecIn(BaseModel):
    pipeline_id: UUID

@router.post("", status_code=201)
async def start_exec(body: ExecIn, pool: asyncpg.Pool = Depends(get_pool)):
    async with pool.acquire() as con:
        row = await con.fetchrow("INSERT INTO executions(pipeline_id) VALUES ($1) RETURNING id, status, started_at", body.pipeline_id)
    return dict(row)


async def _execute_pipeline(eid: UUID, pool: asyncpg.Pool, pipeline_graph: dict) -> None:
    # Simüle edilmiş çalıştırma: sırayla node'lar için log ekle ve sonunda bitir
    try:
        nodes = (pipeline_graph or {}).get("nodes", [])
        # Minimal outputs simülasyonu: type='output' olan node'lar için basit değerler üret
        outputs: dict[str, dict] = {}
        async with pool.acquire() as con:
            # Başlangıç logu
            await con.execute(
                "INSERT INTO execution_steps(execution_id, node_id, level, message, data) VALUES ($1,$2,$3,$4,$5::jsonb)",
                eid, "-", "info", "Execution started", json.dumps({})
            )

            for idx, node in enumerate(nodes):
                node_id = str(node.get("id", f"N{idx}"))
                node_type = str(node.get("type", "node"))
                await con.execute(
                    "INSERT INTO execution_steps(execution_id, node_id, level, message, data) VALUES ($1,$2,$3,$4,$5::jsonb)",
                    eid, node_id, "info", f"Running node {node_id}", json.dumps({"type": node_type})
                )
                await asyncio.sleep(0.2)
                if node_type in ("output", "out"):
                    outputs[node_id] = {"value": idx + 1, "type": node_type}

            await con.execute(
                "INSERT INTO execution_steps(execution_id, node_id, level, message, data) VALUES ($1,$2,$3,$4,$5::jsonb)",
                eid, "-", "success", "Execution finished", json.dumps({"outputs": outputs})
            )

        async with pool.acquire() as con:
            await con.fetchrow(
                "UPDATE executions SET status=$2, finished_at=now(), summary=$3 WHERE id=$1 RETURNING id",
                eid, "success", json.dumps({"outputs": outputs})
            )
    except Exception as e:
        async with pool.acquire() as con:
            await con.execute(
                "INSERT INTO execution_steps(execution_id, node_id, level, message, data) VALUES ($1,$2,$3,$4,$5::jsonb)",
                eid, "-", "error", "Execution failed", json.dumps({"error": str(e)})
            )
            await con.fetchrow(
                "UPDATE executions SET status=$2, finished_at=now(), summary=$3 WHERE id=$1 RETURNING id",
                eid, "failed", "Error"
            )


class RunIn(BaseModel):
    pipeline_id: UUID


@router.post("/run")
async def run_execution(body: RunIn, background: BackgroundTasks, pool: asyncpg.Pool = Depends(get_pool)):
    # Pipeline'ı getir
    async with pool.acquire() as con:
        row = await con.fetchrow("SELECT graph FROM pipelines WHERE id=$1", body.pipeline_id)
    if not row:
        raise HTTPException(404, "pipeline not found")

    graph = row["graph"]
    if isinstance(graph, str):
        try:
            graph = json.loads(graph)
        except Exception:
            graph = {}

    # Execution kaydı oluştur
    async with pool.acquire() as con:
        ex_row = await con.fetchrow("INSERT INTO executions(pipeline_id) VALUES ($1) RETURNING id, status, started_at", body.pipeline_id)
    eid = ex_row["id"]

    # Arka planda çalıştır
    background.add_task(_execute_pipeline, eid, pool, graph)

    return {"id": str(eid), "status": "running"}

@router.post("/{eid}/log", status_code=201)
async def append_log(eid: UUID, level: str = "info", node_id: str = "-", message: str = "", data: dict | None = None, pool: asyncpg.Pool = Depends(get_pool)):
    async with pool.acquire() as con:
        await con.execute("INSERT INTO execution_steps(execution_id, node_id, level, message, data) VALUES ($1,$2,$3,$4,$5::jsonb)",
                          eid, node_id, level, message, json.dumps(data or {}))
    return {"ok": True}

@router.post("/{eid}/finish")
async def finish_exec(eid: UUID, status: str = "success", summary: str = "", pool: asyncpg.Pool = Depends(get_pool)):
    async with pool.acquire() as con:
        row = await con.fetchrow("UPDATE executions SET status=$2, finished_at=now(), summary=$3 WHERE id=$1 RETURNING id, status, finished_at", eid, status, summary)
    if not row: raise HTTPException(404, "not found")
    return dict(row)

@router.get("/{eid}/steps")
async def list_steps(eid: UUID, pool: asyncpg.Pool = Depends(get_pool)):
    async with pool.acquire() as con:
        rows = await con.fetch("SELECT ts, node_id, level, message, data FROM execution_steps WHERE execution_id=$1 ORDER BY ts", eid)
    return [dict(r) for r in rows]

@router.get("/{eid}")
async def get_execution(eid: UUID, pool: asyncpg.Pool = Depends(get_pool)):
    async with pool.acquire() as con:
        row = await con.fetchrow("SELECT id, pipeline_id, status, started_at, finished_at, summary FROM executions WHERE id=$1", eid)
    if not row:
        raise HTTPException(404, "not found")
    return dict(row)



