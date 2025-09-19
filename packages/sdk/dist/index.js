import { z } from 'zod';
export const ApiConfig = z.object({
    baseUrl: z.string().url(),
});
export class ApiClient {
    baseUrl;
    constructor(config) {
        this.baseUrl = config.baseUrl;
    }
    async fetchGraph() {
        const res = await fetch(`${this.baseUrl}/graph`);
        if (!res.ok)
            throw new Error(`Graph fetch failed: ${res.status}`);
        return (await res.json());
    }
    async saveGraph(graph) {
        const res = await fetch(`${this.baseUrl}/graph`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(graph),
        });
        if (!res.ok)
            throw new Error(`Graph save failed: ${res.status}`);
    }
}
