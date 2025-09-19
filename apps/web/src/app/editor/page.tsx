'use client';

import React from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

export default function EditorPage() {
  const [nodes, setNodes] = React.useState<Node[]>([
    { id: 'a', position: { x: 100, y: 100 }, data: { label: 'Sensor A' }, type: 'input' },
    { id: 'b', position: { x: 400, y: 200 }, data: { label: 'Logic B' } },
    { id: 'c', position: { x: 700, y: 100 }, data: { label: 'Actuator C' }, type: 'output' },
  ]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const onConnect = React.useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ padding: 16, borderBottom: '1px solid #eee' }}>
        <strong>Editor</strong>
      </div>
      <div style={{ height: 'calc(100vh - 64px)' }}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={setNodes as any} onEdgesChange={setEdges as any} onConnect={onConnect}>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
