"use client";
import { useEffect, useState } from "react";

type Exec = { id: string; pipeline_id: string; status: string; started_at?: string; finished_at?: string; summary?: any };

export function ExecutionSummary({ executionId }: { executionId: string }) {
  const [exec, setExec] = useState<Exec | null>(null);

  useEffect(() => {
    if (!executionId) return;
    let alive = true;
    async function load() {
      try {
        const r = await fetch(`/api/proxy/executions/${executionId}`);
        if (!r.ok) return;
        const json = await r.json();
        if (alive) setExec(json);
      } catch {}
    }
    load();
    const id = setInterval(load, 2000);
    return () => { alive = false; clearInterval(id); };
  }, [executionId]);

  if (!exec) return <div className="text-xs text-slate-500">Execution bilgisi yükleniyor...</div>;

  return (
    <div className="rounded-md border border-slate-200/60 bg-white/70 p-3 text-sm">
      <div className="flex items-center justify-between">
        <div className="font-medium">Execution Status: <span className="uppercase">{exec.status}</span></div>
        <div className="text-xs text-slate-500">ID: {exec.id}</div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div>Started: {exec.started_at ? new Date(exec.started_at).toLocaleString() : '-'}</div>
        <div>Finished: {exec.finished_at ? new Date(exec.finished_at).toLocaleString() : '-'}</div>
      </div>
      {exec.summary && (
        <div className="mt-2 text-xs text-slate-700">
          <div className="font-medium mb-1">Outputs</div>
          <pre className="bg-slate-50 border border-slate-200 rounded p-2 overflow-auto">
{JSON.stringify(exec.summary?.outputs ?? exec.summary, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}


