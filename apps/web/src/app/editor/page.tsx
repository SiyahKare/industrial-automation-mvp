'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap, addEdge,
  Node, Edge, Connection, NodeTypes,
  applyNodeChanges, applyEdgeChanges,
  type NodeChange, type EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { SensorNode } from '@/components/nodes/SensorNode';
import { ConstantNode } from '@/components/nodes/ConstantNode';
import { OutputNode } from '@/components/nodes/OutputNode';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { useEditorStore } from '@/store/useEditorStore';

const nodeTypes: NodeTypes = {
  input: SensorNode,
  default: ConstantNode,
  output: OutputNode,
};

const initialNodes: Node[] = [
  { id: "S1", position: { x: 50, y: 80 }, data: { label: "Sensor: L1/Power_kW", sensorTag: "L1/Power_kW" }, type: "input" },
  { id: "C1", position: { x: 280, y: 80 }, data: { label: "Constant: TRY/kWh", value: 3.25 }, type: "default" },
  { id: "M1", position: { x: 520, y: 80 }, data: { label: "OUT: Maliyet" }, type: "output" },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "S1", target: "C1" },
  { id: "e2", source: "C1", target: "M1" },
];

export default function EditorPage() {
  const { 
    nodes, edges, setNodes, setEdges, setSelectedNode, 
    savePipeline, activatePipeline 
  } = useEditorStore();

  // Initialize with default nodes if empty
  React.useEffect(() => {
    if (nodes.length === 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [nodes.length, setNodes, setEdges]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(addEdge(connection, edges));
  }, [edges, setEdges]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(applyNodeChanges(changes, nodes));
  }, [nodes, setNodes]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(applyEdgeChanges(changes, edges));
  }, [edges, setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <div className="h-16 bg-gray-100 border-b flex items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Pipeline Editor</h1>
          <div className="space-x-2">
            <button
              onClick={savePipeline}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Pipeline
            </button>
            <button
              onClick={() => activatePipeline()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Activate
            </button>
          </div>
        </div>
        <div className="h-[calc(100vh-4rem)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
      <PropertiesPanel />
    </div>
  );
}