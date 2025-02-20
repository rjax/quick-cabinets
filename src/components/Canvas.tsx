import React from 'react';
import { Stage, Layer } from 'react-konva';
import { Shape } from './Shape';
import { useDesignerStore } from '../store';

export const Canvas: React.FC = () => {
  const { shapes, selectedId, setSelectedId, updateShape } = useDesignerStore();

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    updateShape(id, { x, y });
  };

  return (
    <Stage
      width={800}
      height={600}
      className="border border-gray-300 rounded-lg bg-white"
    >
      <Layer>
        {shapes.map((shape) => (
          <Shape
            key={shape.id}
            {...shape}
            isSelected={shape.id === selectedId}
            onSelect={handleSelect}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  );
};