import React from 'react';
import { Square, Circle, Minus } from 'lucide-react';
import { ToolbarProps } from '../types';

export const Toolbar: React.FC<ToolbarProps> = ({ onAddShape }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <div className="space-y-4">
        <button
          onClick={() => onAddShape('rectangle')}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded"
        >
          <Square className="w-6 h-6" />
        </button>
        <button
          onClick={() => onAddShape('arc')}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded"
        >
          <Circle className="w-6 h-6" />
        </button>
        <button
          onClick={() => onAddShape('line')}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded"
        >
          <Minus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};