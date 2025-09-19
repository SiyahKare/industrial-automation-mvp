import { z } from 'zod';
import type { Graph } from '@industrial/graph';
export declare const ApiConfig: z.ZodObject<{
    baseUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    baseUrl: string;
}, {
    baseUrl: string;
}>;
export type ApiConfig = z.infer<typeof ApiConfig>;
export declare class ApiClient {
    private readonly baseUrl;
    constructor(config: ApiConfig);
    fetchGraph(): Promise<Graph>;
    saveGraph(graph: Graph): Promise<void>;
}
export type { Graph } from '@industrial/graph';
