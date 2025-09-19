import { z } from 'zod';
import type { Graph } from '@industrial/graph';

export const ApiConfig = z.object({
  baseUrl: z.string().url(),
});
export type ApiConfig = z.infer<typeof ApiConfig>;

export class ApiClient {
  private readonly baseUrl: string;
  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
  }

  async fetchGraph(): Promise<Graph> {
    const res = await fetch(`${this.baseUrl}/graph`);
    if (!res.ok) throw new Error(`Graph fetch failed: ${res.status}`);
    return (await res.json()) as Graph;
  }

  async saveGraph(graph: Graph): Promise<void> {
    const res = await fetch(`${this.baseUrl}/graph`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graph),
    });
    if (!res.ok) throw new Error(`Graph save failed: ${res.status}`);
  }
}

export type { Graph } from '@industrial/graph';
