"use client";
import { Registry } from "@/lib/registry";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  Hash, 
  Target, 
  Zap, 
  Calculator, 
  TrendingUp,
  DollarSign,
  GripVertical
} from "lucide-react";

const fetcher = (u: string) => fetch(u).then(r => r.json());

const iconMap: Record<string, any> = {
  sensor: Activity,
  constant: Hash,
  multiply: Calculator,
  integrator: TrendingUp,
  tariff: DollarSign,
  out: Target,
};

const colorMap: Record<string, string> = {
  "I/O": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Math": "bg-amber-100 text-amber-700 border-amber-200", 
  "Cost": "bg-purple-100 text-purple-700 border-purple-200",
};

export default function Palette() {
  const { data: sensorList } = useSWR("/api/proxy/sensors/list", fetcher);

  // Group nodes by category
  const categories = Object.values(Registry).reduce((acc, spec) => {
    const cat = spec.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(spec);
    return acc;
  }, {} as Record<string, any[]>);

  const handleDragStart = (e: React.DragEvent, nodeType: string, issensor = false) => {
    if (issensor) {
      e.dataTransfer.setData('application/json', JSON.stringify({ type: 'sensor' }));
    } else {
      e.dataTransfer.setData('app/nodeType', nodeType);
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-6">
      {/* Sensors Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-700">Sensors</h3>
          <Badge variant="outline" className="text-xs">
            {sensorList?.length || 0}
          </Badge>
        </div>
        
        <Card>
          <CardContent className="p-3">
            {!sensorList ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                <div className="w-3 h-3 border border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                Loading...
              </div>
            ) : sensorList.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-4">
                No sensors available
              </div>
            ) : (
              <div className="grid gap-2 max-h-32 overflow-y-auto scrollbar-thin pr-1">
                {sensorList.map((sensor: any) => (
                  <Button
                    key={sensor.tag}
                    variant="ghost"
                    size="sm"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'sensor', true)}
                    className="justify-start h-8 px-2 cursor-grab active:cursor-grabbing hover:bg-emerald-50"
                  >
                    <GripVertical className="w-3 h-3 text-slate-400 mr-2" />
                    <Activity className="w-3 h-3 text-emerald-600 mr-2" />
                    <span className="text-xs truncate">{sensor.tag}</span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Component Categories */}
      {Object.entries(categories).map(([category, specs]) => {
        const categoryColor = colorMap[category] || "bg-slate-100 text-slate-700 border-slate-200";
        
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-700">{category}</h3>
              <Badge variant="outline" className="text-xs">
                {specs.length}
              </Badge>
            </div>
            
            <Card>
              <CardContent className="p-3">
                <div className="grid gap-2">
                  {specs.map((spec) => {
                    const Icon = iconMap[spec.type] || Hash;
                    return (
                      <Button
                        key={spec.type}
                        variant="ghost"
                        size="sm"
                        draggable
                        onDragStart={(e) => handleDragStart(e, spec.type)}
                        className="justify-start h-10 px-3 cursor-grab active:cursor-grabbing hover:bg-slate-50"
                      >
                        <GripVertical className="w-3 h-3 text-slate-400 mr-2" />
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 ${categoryColor}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-xs font-medium text-slate-700">
                            {spec.label}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {spec.type}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}