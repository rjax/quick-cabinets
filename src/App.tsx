import React from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { SnapControls } from './components/SnapControls';
import { useDesignerStore } from './store';
import { Point } from './types';

function App() {
  const addShape = useDesignerStore((state) => state.addShape);

  const handleAddShape = (type: 'rectangle' | 'line' | 'arc') => {
    if (type === 'line') {
      const newShape = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        x: 100,
        y: 100,
        rotation: 0,
        draggable: true,
        points: [
          { x: 100, y: 100 },
          { x: 200, y: 100 }
        ] as [Point, Point]
      };
      addShape(newShape);
    } else {
      const newShape = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        x: 100,
        y: 100,
        width: type === 'line' ? 100 : 80,
        height: type === 'line' ? 2 : 80,
        rotation: 0,
        draggable: true,
      };
      addShape(newShape);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Cabinet Designer
        </h1>
        <div className="flex gap-8">
          <div className="space-y-4">
            <Toolbar onAddShape={handleAddShape} />
            <SnapControls />
          </div>
          <div className="flex-1">
            <Canvas />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;