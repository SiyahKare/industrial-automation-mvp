"use client";
import { Registry } from "@/lib/registry";
import { useGraphStore } from "@/store/graph";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Info, Zap } from "lucide-react";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function ParamPanel() {
  const { selectedNodeId, nodes, params, setParam } = useGraphStore();
  const node = nodes.find(n => n.id === selectedNodeId);
  // node.data.nodeType içinde orijinal tip var (sensor, constant, out)
  const nodeType = node?.data?.nodeType || node?.type || "";
  const spec = node ? (Registry as any)[nodeType] : undefined;

  const { data: sensorList } = useSWR("/api/proxy/sensors/list", fetcher);

  if (!node) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">No Node Selected</h3>
        <p className="text-xs text-slate-500">
          Click on a node in the canvas to view and edit its properties.
        </p>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">Unknown Node Type</h3>
        <p className="text-xs text-slate-500">
          This node type ({nodeType}) is not recognized.
        </p>
      </div>
    );
  }

  const vals = (params as any)[node.id] || {};

  const Field = (p: any) => {
    const v = vals[p.key] ?? p.default ?? "";
    const onChange = (val: any) => setParam(node.id, p.key, val);

    switch (p.type) {
      case "string":
        return (
          <Input
            value={v}
            onChange={e => onChange(e.target.value)}
            placeholder={p.placeholder}
            className="bg-white/80 backdrop-blur-sm"
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={v}
            onChange={e => onChange(Number(e.target.value))}
            min={p.min}
            max={p.max}
            step={p.step || 0.01}
            className="bg-white/80 backdrop-blur-sm"
          />
        );
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={v}
              onChange={e => onChange(e.target.checked)}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-600">{v ? 'Enabled' : 'Disabled'}</span>
          </div>
        );
      case "select":
        return (
          <Select value={v} onValueChange={onChange}>
            <SelectTrigger className="bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              {p.options?.map((opt: any) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "sensorTag":
        return (
          <Select value={v} onValueChange={onChange}>
            <SelectTrigger className="bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Select sensor..." />
            </SelectTrigger>
            <SelectContent>
              {sensorList?.map((sensor: any) => (
                <SelectItem key={sensor.tag} value={sensor.tag}>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-emerald-500" />
                    {sensor.tag}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "unit":
        return (
          <Select value={v} onValueChange={onChange}>
            <SelectTrigger className="bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Select unit..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kW">kW (Power)</SelectItem>
              <SelectItem value="kWh">kWh (Energy)</SelectItem>
              <SelectItem value="A">A (Current)</SelectItem>
              <SelectItem value="V">V (Voltage)</SelectItem>
              <SelectItem value="°C">°C (Temperature)</SelectItem>
              <SelectItem value="m³/h">m³/h (Flow)</SelectItem>
              <SelectItem value="bar">bar (Pressure)</SelectItem>
              <SelectItem value="TRY">TRY (Currency)</SelectItem>
            </SelectContent>
          </Select>
        );
      case "credential":
        return (
          <Input
            type="password"
            value={v}
            onChange={e => onChange(e.target.value)}
            placeholder="Enter credential..."
            className="bg-white/80 backdrop-blur-sm"
          />
        );
      default:
        return (
          <Input
            value={v}
            onChange={e => onChange(e.target.value)}
            className="bg-white/80 backdrop-blur-sm"
          />
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Node Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              nodeType === 'sensor' ? 'bg-emerald-500' :
              nodeType === 'constant' ? 'bg-amber-500' : 'bg-red-500'
            }`}>
              <Settings className="w-4 h-4 text-white" />
            </div>
            Node Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Node ID</label>
            <div className="text-sm font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded mt-1">
              {node.id}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Type</label>
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                {spec.label}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Category</label>
            <div className="text-sm text-slate-700 mt-1">{spec.category}</div>
          </div>
        </CardContent>
      </Card>

      {/* Parameters */}
      {spec.params && spec.params.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spec.params.map((param: any) => (
              <div key={param.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">
                    {param.label}
                  </label>
                  {param.required && (
                    <Badge variant="destructive" className="text-xs h-4">
                      Required
                    </Badge>
                  )}
                </div>
                <Field {...param} />
                {param.placeholder && (
                  <p className="text-xs text-slate-500">{param.placeholder}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Inputs & Outputs */}
      {(spec.inputs?.length > 0 || spec.outputs?.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spec.inputs?.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-slate-600 mb-2">Inputs</h4>
                <div className="space-y-1">
                  {spec.inputs.map((input: any) => (
                    <div key={input.key} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-xs text-slate-700">{input.label}</span>
                      <Badge variant="outline" className="text-xs">{input.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {spec.outputs?.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-slate-600 mb-2">Outputs</h4>
                <div className="space-y-1">
                  {spec.outputs.map((output: any) => (
                    <div key={output.key} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-xs text-slate-700">{output.label}</span>
                      <Badge variant="outline" className="text-xs">{output.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}