import { useEditorStore } from '@/store/useEditorStore';

export function PropertiesPanel() {
  const { selectedNode, updateNode } = useEditorStore();
  
  if (!selectedNode) {
    return (
      <div className="w-80 h-full bg-gray-50 p-4">
        <h3 className="text-lg font-semibold mb-4">Properties</h3>
        <p className="text-gray-500">Select a node to edit its properties</p>
      </div>
    );
  }
  
  return (
    <div className="w-80 h-full bg-gray-50 p-4">
      <h3 className="text-lg font-semibold mb-4">Properties</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={selectedNode.data?.label || ''}
            onChange={(e) => updateNode(selectedNode.id, {
              data: { ...selectedNode.data, label: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={selectedNode.type || 'default'}
            onChange={(e) => updateNode(selectedNode.id, { type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="input">Input</option>
            <option value="default">Default</option>
            <option value="output">Output</option>
          </select>
        </div>
        
        {selectedNode.type === 'input' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sensor Tag
            </label>
            <input
              type="text"
              value={selectedNode.data?.sensorTag || ''}
              onChange={(e) => updateNode(selectedNode.id, {
                data: { ...selectedNode.data, sensorTag: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="L1/Power_kW"
            />
          </div>
        )}
        
        {selectedNode.type === 'default' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="number"
              value={selectedNode.data?.value || ''}
              onChange={(e) => updateNode(selectedNode.id, {
                data: { ...selectedNode.data, value: parseFloat(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3.25"
            />
          </div>
        )}
      </div>
    </div>
  );
}

