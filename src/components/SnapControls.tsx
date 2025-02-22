import React from 'react';
import { Grid, Magnet, Box, Settings } from 'lucide-react';
import { useDesignerStore } from '../store';

export const SnapControls: React.FC = () => {
  // Get snap configuration and update function from store
  const { snapConfig, updateSnapConfig } = useDesignerStore();

  // Toggle master snapping on/off
  const toggleSnapping = () => {
    updateSnapConfig({ enabled: !snapConfig.enabled });
  };

  // Toggle grid visibility
  const toggleGrid = () => {
    updateSnapConfig({ showGrid: !snapConfig.showGrid });
  };

  // Change snapping mode
  const changeMode = (mode: typeof snapConfig.mode) => {
    updateSnapConfig({ mode });
  };

  // Toggle between contact and gap modes for adjacency
  const toggleAdjacencyMode = () => {
    updateSnapConfig({
      adjacencyMode: snapConfig.adjacencyMode === 'contact' ? 'gap' : 'contact'
    });
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg space-y-4">
      {/* Master snapping toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Snapping Controls</span>
        <button
          onClick={toggleSnapping}
          className={`p-2 rounded ${
            snapConfig.enabled ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
          title="Toggle Snapping"
        >
          <Magnet className="w-5 h-5" />
        </button>
      </div>

      {/* Snapping mode buttons */}
      <div className="space-y-2">
        {/* Grid mode */}
        <button
          onClick={() => changeMode('grid')}
          className={`w-full flex items-center justify-between p-2 rounded ${
            snapConfig.mode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center">
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </span>
          {snapConfig.mode === 'grid' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGrid();
              }}
              className={`p-1 rounded ${
                snapConfig.showGrid ? 'bg-blue-200' : 'bg-gray-100'
              }`}
              title="Toggle Grid Visibility"
            >
              <Settings className="w-3 h-3" />
            </button>
          )}
        </button>

        {/* Anchor mode */}
        <button
          onClick={() => changeMode('anchor')}
          className={`w-full flex items-center p-2 rounded ${
            snapConfig.mode === 'anchor' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
        >
          <Magnet className="w-4 h-4 mr-2" />
          Anchor Points
        </button>

        {/* Adjacency mode */}
        <button
          onClick={() => changeMode('adjacency')}
          className={`w-full flex items-center justify-between p-2 rounded ${
            snapConfig.mode === 'adjacency' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center">
            <Box className="w-4 h-4 mr-2" />
            Adjacency
          </span>
          {snapConfig.mode === 'adjacency' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleAdjacencyMode();
              }}
              className="text-xs px-2 py-1 rounded bg-blue-200"
            >
              {snapConfig.adjacencyMode === 'contact' ? 'Contact' : 'Gap'}
            </button>
          )}
        </button>
      </div>

      {/* Configuration sliders */}
      {snapConfig.enabled && (
        <div className="space-y-2 pt-4 border-t">
          {/* Grid size control */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Grid Size</label>
            <input
              type="range"
              min="10"
              max="50"
              step="10"
              value={snapConfig.gridSize}
              onChange={(e) => updateSnapConfig({ gridSize: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-right">{snapConfig.gridSize}px</div>
          </div>

          {/* Snap threshold control */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Snap Threshold</label>
            <input
              type="range"
              min="5"
              max="20"
              value={snapConfig.snapThreshold}
              onChange={(e) => updateSnapConfig({ snapThreshold: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-right">{snapConfig.snapThreshold}px</div>
          </div>

          {/* Gap distance control (only shown in adjacency gap mode) */}
          {snapConfig.mode === 'adjacency' && snapConfig.adjacencyMode === 'gap' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Gap Distance</label>
              <input
                type="range"
                min="0"
                max="50"
                value={snapConfig.adjacencyGap}
                onChange={(e) => updateSnapConfig({ adjacencyGap: Number(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">{snapConfig.adjacencyGap}px</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};