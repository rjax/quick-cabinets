import React from 'react';
import { Stage, Layer } from 'react-konva';
import { Shape } from './Shape';
import { useDesignerStore } from '../store';
import { Point } from '../types';

export const Canvas: React.FC = () => {
  const { shapes, selectedId, setSelectedId, updateShape, updateLinePoint } = useDesignerStore();

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    updateShape(id, { x, y });
  };

  const handlePointDragEnd = (id: string, pointIndex: number, point: Point) => {
    updateLinePoint(id, pointIndex, point);
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
            onPointDragEnd={handlePointDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  );
};