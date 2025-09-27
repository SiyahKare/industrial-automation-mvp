import asyncpg
import json
from uuid import UUID
from datetime import datetime
from typing import Any
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel

router = APIRouter(prefix="/api/pipelines", tags=["pipelines"])


async def get_pool_dep(request: Request) -> asyncpg.Pool:
    return request.app.state.pool


def _row_to_pipeline_out(row: asyncpg.Record) -> dict:
    data = dict(row)
    graph_value = data.get("graph")
    if isinstance(graph_value, str):
        try:
            data["graph"] = json.loads(graph_value)
        except Exception:
            pass
    return data


class PipelineIn(BaseModel):
    name: str
    graph: dict


class PipelineOut(BaseModel):
    id: UUID
    name: str
    graph: dict
    status: str
    created_at: datetime
    updated_at: datetime


@router.post("", response_model=PipelineOut)
async def create_pipeline(body: PipelineIn, pool: asyncpg.Pool = Depends(get_pool_dep)):
    async with pool.acquire() as con:
        row = await con.fetchrow(
            """INSERT INTO pipelines(name, graph)
               VALUES ($1, $2::jsonb)
               RETURNING id, name, graph, status, created_at, updated_at""",
            body.name,
            json.dumps(body.graph),
        )
    return _row_to_pipeline_out(row)


@router.get("/{pid}", response_model=PipelineOut)
async def get_pipeline(pid: UUID, pool: asyncpg.Pool = Depends(get_pool_dep)):
    async with pool.acquire() as con:
        row = await con.fetchrow(
            "SELECT id, name, graph, status, created_at, updated_at FROM pipelines WHERE id=$1",
            pid,
        )
    if not row:
        raise HTTPException(404, "pipeline not found")
    return _row_to_pipeline_out(row)


@router.put("/{pid}/activate", response_model=PipelineOut)
async def activate_pipeline(pid: UUID, pool: asyncpg.Pool = Depends(get_pool_dep)):
    async with pool.acquire() as con:
        row = await con.fetchrow(
            """UPDATE pipelines
               SET status='active'
               WHERE id=$1
               RETURNING id, name, graph, status, created_at, updated_at""",
            pid,
        )
    if not row:
        raise HTTPException(404, "pipeline not found")
    return _row_to_pipeline_out(row)


