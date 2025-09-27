import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap } from 'lucide-react';

export function SensorNode({ data, isConnectable = true, selected }: NodeProps<any>) {
  return (
    <Card className={`w-48 transition-all duration-200 hover:shadow-lg ${
      selected ? 'ring-2 ring-emerald-500 shadow-lg' : 'hover:shadow-md'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-slate-800 truncate">
              {data.label || 'Sensor'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                Input
              </Badge>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Zap className="w-3 h-3" />
                Live
              </div>
            </div>
          </div>
        </div>
        
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 bg-emerald-500 border-2 border-white shadow-sm hover:scale-110 transition-transform" 
          isConnectable={isConnectable} 
        />
      </CardContent>
    </Card>
  );
}