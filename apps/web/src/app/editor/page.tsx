'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap, addEdge, MarkerType,
  Node, Edge, Connection, NodeTypes,
  applyNodeChanges, applyEdgeChanges,
  ReactFlowProvider, useReactFlow, ConnectionMode,
  type NodeChange, type EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { SensorNode } from '@/components/nodes/SensorNode';
import { ConstantNode } from '@/components/nodes/ConstantNode';
import { OutputNode } from '@/components/nodes/OutputNode';
import TimeSeriesChart from '@/components/TimeSeriesChart';
import { ExecutionLogs } from '@/components/ExecutionLogs';
import { ExecutionSummary } from '@/components/ExecutionSummary';
import TagPicker from '@/components/TagPicker';
import Palette from '@/components/Palette';
import ParamPanel from '@/components/ParamPanel';
import { useGraphStore } from '@/store/graph';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Activity, 
  Trash2, 
  RotateCcw, 
  Play, 
  Settings, 
  Zap, 
  BarChart3,
  PanelLeftOpen,
  PanelRightOpen,
  Layers
} from 'lucide-react';

const nodeTypes: NodeTypes = {
  sensor: SensorNode,
  constant: ConstantNode,
  output: OutputNode,
};

const initialNodes: Node[] = [
  { id: "S1", position: { x: 50, y: 80 }, data: { label: "Power Sensor", nodeType: "sensor" }, type: "sensor" },
  { id: "C1", position: { x: 300, y: 80 }, data: { label: "Tariff Rate", nodeType: "constant" }, type: "constant" },
  { id: "M1", position: { x: 550, y: 80 }, data: { label: "Cost Output", nodeType: "out" }, type: "output" },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "S1", target: "C1", animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: "e2", source: "C1", target: "M1", animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
];

function ExecutionPanels() {
  const [execId, setExecId] = React.useState<string>("");
  React.useEffect(() => {
    const read = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const m = hash.match(/exec=([^&]+)/);
      setExecId(m?.[1] || "");
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  if (!execId) {
    return <div className="text-xs text-slate-500">Run sonrası özet ve loglar burada görünecek.</div>;
  }
  return (
    <>
      <ExecutionSummary executionId={execId} />
      <ExecutionLogs executionId={execId} />
    </>
  );
}

function EditorComponent() {
  const [tags, setTags] = useState<string[]>(['Area1/Flow_01', 'Area1/Temp_01']);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const { nodes, edges, setNodes, setEdges, selectNode, deleteSelected, clear, addNodeFromSpec } = useGraphStore();
  const reactFlowInstance = useReactFlow();

  // Initialize with default nodes if empty
  React.useEffect(() => {
    if (nodes.length === 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [nodes.length, setNodes, setEdges]);

  const onConnect = useCallback((connection: Connection) => {
    const styled = { 
      ...connection, 
      id: `e-${connection.source}-${connection.target}`,
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
      style: { stroke: '#10b981', strokeWidth: 2 },
      animated: true
    };
    setEdges((prev) => addEdge(styled, prev));
  }, [setEdges]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((prev) => applyNodeChanges(changes, prev));
  }, [setNodes]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((prev) => applyEdgeChanges(changes, prev));
  }, [setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    selectNode(node.id);
  }, [selectNode]);

  const onPaneClick = useCallback(() => {
    selectNode(undefined);
  }, [selectNode]);

  // Keyboard: Delete / Backspace
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [deleteSelected]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const position = reactFlowInstance.project({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    
    const t = e.dataTransfer.getData('app/nodeType');
    if (t) {
      addNodeFromSpec(t, position);
      return;
    }
    
    const raw = e.dataTransfer.getData('application/json');
    if (raw) {
      try {
        const payload = JSON.parse(raw);
        if (payload?.type === 'sensor') {
          addNodeFromSpec('sensor', position);
        }
      } catch {}
    }
  }, [addNodeFromSpec, reactFlowInstance]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-gradient-to-r from-white via-slate-50 to-white backdrop-blur-lg border-b border-slate-200/60 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Pipeline Editor
              </h1>
              <p className="text-xs text-slate-500 font-medium">Industrial Automation Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600 ml-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="hidden lg:flex"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button variant="outline" size="sm" onClick={deleteSelected}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          
          <Button variant="outline" size="sm" onClick={clear}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 pulse-glow"
            onClick={async () => {
              try {
                console.log("🚀 Starting pipeline execution...");
                
                // Validate pipeline
                if (nodes.length === 0) {
                  alert("❌ Pipeline boş! En az bir node ekleyin.");
                  return;
                }
                
                // Create pipeline graph
                const pipelineGraph = {
                  nodes: nodes.map(node => ({
                    id: node.id,
                    type: node.data?.nodeType || node.type,
                    data: node.data,
                    position: node.position
                  })),
                  edges: edges.map(edge => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    type: edge.type
                  }))
                };
                
                // Save pipeline to database
                const response = await fetch('/api/pipelines', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: `Pipeline ${new Date().toLocaleString()}`,
                    graph: pipelineGraph
                  })
                });
                
                if (!response.ok) {
                  throw new Error('Pipeline kaydedilemedi');
                }
                
                const pipeline = await response.json();
                console.log("✅ Pipeline saved:", pipeline.id);
                
                // Run execution (background)
                const runRes = await fetch('/api/proxy/executions/run', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ pipeline_id: pipeline.id })
                });
                if (!runRes.ok) throw new Error('Execution başlatılamadı');
                const runJson = await runRes.json();
                const execId = runJson.id;
                console.log('🎯 Execution started:', execId);
                
                // Show success message
                alert(`🎉 Pipeline kaydedildi ve execution başlatıldı!\n\n📊 Nodes: ${nodes.length}\n🔗 Connections: ${edges.length}\n🆔 Pipeline ID: ${pipeline.id}\n▶️ Execution ID: ${execId}`);

                // Store execution id into URL hash for logs
                if (typeof window !== 'undefined') {
                  const u = new URL(window.location.href);
                  u.hash = `exec=${execId}`;
                  window.history.replaceState(null, '', u.toString());
                }
                
              } catch (error) {
                console.error("❌ Pipeline execution failed:", error);
                alert(`❌ Pipeline çalıştırılamadı!\n\nHata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}\n\nLütfen tekrar deneyin.`);
              }
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            🚀 Run Pipeline
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="hidden lg:flex"
          >
            <PanelRightOpen className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        {leftPanelOpen && (
          <aside className="w-80 bg-white/50 backdrop-blur-sm border-r border-slate-200/60 flex flex-col">
            <Tabs defaultValue="sensors" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-4 mb-2">
                <TabsTrigger value="sensors" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Sensors
                </TabsTrigger>
                <TabsTrigger value="components" className="text-xs">
                  <Layers className="w-3 h-3 mr-1" />
                  Components
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sensors" className="flex-1 px-4 pb-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Select Sensors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TagPicker onChange={setTags} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="components" className="flex-1 px-4 pb-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Drag & Drop Components</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Palette />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </aside>
        )}

        {/* Mobile Left Panel */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden fixed top-20 left-4 z-50">
              <PanelLeftOpen className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Components & Sensors</SheetTitle>
            </SheetHeader>
            <Tabs defaultValue="sensors" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sensors">Sensors</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
              </TabsList>
              <TabsContent value="sensors" className="mt-4">
                <TagPicker onChange={setTags} />
              </TabsContent>
              <TabsContent value="components" className="mt-4">
                <Palette />
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 relative bg-slate-50" style={{ minHeight: '600px' }}>
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
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              selectNodesOnDrag={false}
              panOnDrag={[1, 2]}
              connectionMode={ConnectionMode.Loose}
              defaultEdgeOptions={{ 
                animated: true, 
                markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
                style: { stroke: '#10b981', strokeWidth: 2 }
              }}
              connectionLineStyle={{ stroke: '#10b981', strokeWidth: 3 }}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
              onDrop={onDrop}
              className="w-full h-full"
            >
              <Background color="#e2e8f0" gap={20} />
              <Controls className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg shadow-lg" />
              <MiniMap 
                className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg shadow-lg"
                nodeColor={(node) => {
                  switch (node.type) {
                    case 'sensor': return '#10b981';
                    case 'constant': return '#f59e0b';
                    case 'output': return '#ef4444';
                    default: return '#6b7280';
                  }
                }}
              />
            </ReactFlow>
          </div>

          {/* Chart Section */}
          <div className="h-80 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm border-t border-slate-200/60 p-6 shadow-lg">
            <div className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-3 h-3 text-white" />
                  </div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    📈 Live Data Visualization
                  </h2>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gradient-to-r from-emerald-100 to-blue-100 text-slate-700 border border-emerald-200 shadow-sm">
                        <Activity className="w-3 h-3 mr-1 text-emerald-600" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-white/50 rounded-lg p-4 shadow-inner border border-slate-200/50 h-full">
                <TimeSeriesChart 
                  tags={tags} 
                  start="-2h" 
                  bucket="5m" 
                  agg="avg" 
                  refreshMs={10000} 
                  height={240}
                />
              </div>
              {/* Execution Summary + Logs */}
              <ExecutionPanels />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        {rightPanelOpen && (
          <aside className="w-80 bg-white/50 backdrop-blur-sm border-l border-slate-200/60">
            <Card className="h-full rounded-none border-0">
              <CardHeader className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Node Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <ParamPanel />
              </CardContent>
            </Card>
          </aside>
        )}

        {/* Mobile Right Panel removed to avoid double mounting ParamPanel */}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <ReactFlowProvider>
      <EditorComponent />
    </ReactFlowProvider>
  );
}