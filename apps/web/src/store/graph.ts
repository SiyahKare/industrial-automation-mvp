import { create } from "zustand";
import { nanoid } from "nanoid";
import { Node, Edge } from "reactflow";

type ParamBag = Record<string, any>;
type NodeParams = Record<string, ParamBag>;

type GraphState = {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId?: string;
  params: NodeParams;

  setNodes: (n: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (e: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  selectNode: (id?: string) => void;
  setParam: (nodeId: string, key: string, value: any) => void;
  addNodeFromSpec: (type: string, position: {x:number;y:number}) => void;
  clear: () => void;
  deleteSelected: () => void;
};

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [], edges: [], params: {},

  setNodes: (nodes) => set({ nodes: typeof nodes === 'function' ? (nodes as any)(get().nodes) : nodes }),
  setEdges: (edges) => set({ edges: typeof edges === 'function' ? (edges as any)(get().edges) : edges }),
  selectNode: (id) => set({ selectedNodeId: id }),

  setParam: (nodeId, key, value) => {
    const nextParams = { ...(get().params[nodeId]||{}), [key]: value };
    set({ params: { ...get().params, [nodeId]: nextParams } });
  },

  addNodeFromSpec: (type, position) => {
    const id = nanoid(8);
    // React Flow node types - bunları custom node component adlarıyla eşleştir
    let nodeType = 'default';
    if (type === 'sensor') nodeType = 'sensor';
    else if (type === 'constant') nodeType = 'constant';
    else if (type === 'out' || type === 'output') nodeType = 'output';
    
    const label = type === 'sensor' ? 'Power Sensor' : type.toUpperCase();
    const node: Node = {
      id, 
      type: nodeType, 
      position, 
      data: { label, nodeType: type }, 
      selectable: true, 
      draggable: true,
      connectable: true
    };
    // Initialize default params for sensor
    const nextParams = { ...get().params } as any;
    if (type === 'sensor') {
      nextParams[id] = { tag: '', unit: 'kW' };
    }
    set({ nodes: [...get().nodes, node], params: nextParams });
  },

  clear: () => set({ nodes: [], edges: [], params: {}, selectedNodeId: undefined }),

  deleteSelected: () => {
    const { selectedNodeId, nodes, edges, params } = get();
    if (!selectedNodeId) return;
    set({
      nodes: nodes.filter(n => n.id !== selectedNodeId),
      edges: edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId),
      params: Object.fromEntries(Object.entries(params).filter(([k]) => k !== selectedNodeId)),
      selectedNodeId: undefined
    });
  },
}));


