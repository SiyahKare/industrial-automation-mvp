import { Handle, Position } from 'reactflow';

export function OutputNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-red-50 border-2 border-red-200">
      <div className="flex">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">Output</div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
    </div>
  );
}

