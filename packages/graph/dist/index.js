import { z } from 'zod';
export const NodeId = z.string().min(1);
export const NodeType = z.enum(['sensor', 'actuator', 'logic', 'ui']);
export const Port = z.object({
    id: z.string().min(1),
    kind: z.enum(['input', 'output']),
    dataType: z.enum(['number', 'string', 'boolean']),
});
export const GraphNode = z.object({
    id: NodeId,
    type: NodeType,
    label: z.string().min(1),
    position: z.object({ x: z.number(), y: z.number() }),
    inputs: z.array(Port).default([]),
    outputs: z.array(Port).default([]),
    config: z.record(z.any()).optional(),
});
export const GraphEdge = z.object({
    id: z.string().min(1),
    source: NodeId,
    sourceHandle: z.string().optional(),
    target: NodeId,
    targetHandle: z.string().optional(),
});
export const Graph = z.object({
    nodes: z.array(GraphNode),
    edges: z.array(GraphEdge),
    version: z.literal(1),
});
export function createEmptyGraph() {
    return { nodes: [], edges: [], version: 1 };
}
