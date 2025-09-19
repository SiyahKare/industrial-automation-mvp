import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from 'reactflow';

interface EditorState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  lastPipelineId?: string;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNode: (node: Node | null) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  savePipeline: () => Promise<string | undefined>;
  activatePipeline: (id?: string) => Promise<void>;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNode: null,
      lastPipelineId: undefined,
      
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      setSelectedNode: (node) => set({ selectedNode: node }),
      
      addNode: (node) => set((state) => ({ 
        nodes: [...state.nodes, node] 
      })),
      
      updateNode: (id, updates) => set((state) => ({
        nodes: state.nodes.map(node => 
          node.id === id ? { ...node, ...updates } : node
        )
      })),
      
      deleteNode: (id) => set((state) => ({
        nodes: state.nodes.filter(node => node.id !== id),
        edges: state.edges.filter(edge => 
          edge.source !== id && edge.target !== id
        )
      })),
      
      savePipeline: async () => {
        const { nodes, edges } = get();
        const pipeline = { nodes, edges, version: 1 };
        
        const resp = await fetch('/api/pipelines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pipeline)
        });
        try {
          const json = await resp.json();
          const id: string | undefined = json?.id ?? json?.pipelineId ?? json?.data?.id;
          if (id) {
            set({ lastPipelineId: id });
          }
          return id;
        } catch {
          return undefined;
        }
      },
      
      activatePipeline: async (id?: string) => {
        const effectiveId = id && id !== 'current' ? id : get().lastPipelineId;
        if (!effectiveId) return;
        await fetch(`/api/pipelines/${effectiveId}/activate`, {
          method: 'PUT'
        });
      }
    }),
    {
      name: 'editor-store',
      partialize: (state) => ({ 
        nodes: state.nodes, 
        edges: state.edges 
      })
    }
  )
);
