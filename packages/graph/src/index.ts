import { z } from 'zod';

export const NodeId = z.string().min(1);
export type NodeId = z.infer<typeof NodeId>;

export const NodeType = z.enum(['sensor', 'actuator', 'logic', 'ui']);
export type NodeType = z.infer<typeof NodeType>;

export const Port = z.object({
  id: z.string().min(1),
  kind: z.enum(['input', 'output']),
  dataType: z.enum(['number', 'string', 'boolean']),
});
export type Port = z.infer<typeof Port>;

export const GraphNode = z.object({
  id: NodeId,
  type: NodeType,
  label: z.string().min(1),
  position: z.object({ x: z.number(), y: z.number() }),
  inputs: z.array(Port).default([]),
  outputs: z.array(Port).default([]),
  config: z.record(z.any()).optional(),
});
export type GraphNode = z.infer<typeof GraphNode>;

export const GraphEdge = z.object({
  id: z.string().min(1),
  source: NodeId,
  sourceHandle: z.string().optional(),
  target: NodeId,
  targetHandle: z.string().optional(),
});
export type GraphEdge = z.infer<typeof GraphEdge>;

export const Graph = z.object({
  nodes: z.array(GraphNode),
  edges: z.array(GraphEdge),
  version: z.literal(1),
});
export type Graph = z.infer<typeof Graph>;

export function createEmptyGraph(): Graph {
  return { nodes: [], edges: [], version: 1 };
}
