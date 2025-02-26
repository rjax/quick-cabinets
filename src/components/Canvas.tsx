import React from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { Shape } from './Shape';
import { useDesignerStore } from '../store';
import { Point } from '../types';
import { applySnapping } from '../utils/snapping';

export const Canvas: React.FC = () => {
  // Get state and actions from store
  const {
    shapes,
    selectedId,
    snapConfig,
    snapGuides,
    setSelectedId,
    updateShape,
    updateLinePoint,
    updateLinePoint2,
    setSnapGuides,
    clearSnapGuides
  } = useDesignerStore();

  // Handle shape selection
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  // Handle shape drag end with snapping
  const handleDragEnd = (id: string, x: number, y: number) => {
    const shape = shapes.find(s => s.id === id);
    if (!shape) return;

    // Apply snapping based on current mode
    const { snappedShape, guides } = applySnapping(
      { ...shape, x, y },
      shapes.filter(s => s.id !== id),
      snapConfig
    );

    updateShape(id, snappedShape);
    setSnapGuides(guides);
  };

  // Handle line endpoint dragging
  const handleLineDragEnd = (id: string, pointIndex: number, point: Point) => {
    updateLinePoint(id, pointIndex, point);
  };

  const handlePointDragEnd = (id: string, pointIndex: number, point: Point) => {
    updateLinePoint2(id, pointIndex, point);
  };

  // Clear guides when starting to drag
  const handleDragStart = () => {
    clearSnapGuides();
  };

  return (
    <Stage
      width={800}
      height={600}
      className="border border-gray-300 rounded-lg bg-white"
    >
      <Layer>
        {/* Render grid if enabled and in grid mode */}
        {snapConfig.enabled && snapConfig.showGrid && snapConfig.mode === 'grid' && (
          <>
            {/* Vertical grid lines */}
            {Array.from({ length: Math.floor(800 / snapConfig.gridSize) }).map((_, i) => (
              <Line
                key={`v${i}`}
                points={[i * snapConfig.gridSize, 0, i * snapConfig.gridSize, 600]}
                stroke="#ddd"
                strokeWidth={1}
              />
            ))}
            {/* Horizontal grid lines */}
            {Array.from({ length: Math.floor(600 / snapConfig.gridSize) }).map((_, i) => (
              <Line
                key={`h${i}`}
                points={[0, i * snapConfig.gridSize, 800, i * snapConfig.gridSize]}
                stroke="#ddd"
                strokeWidth={1}
              />
            ))}
          </>
        )}

        {/* Render snap alignment guides */}
        {snapGuides.map((guide, i) => (
          <Line
            key={`guide${i}`}
            points={
              guide.type === 'vertical'
                ? [guide.position, 0, guide.position, 600]
                : [0, guide.position, 800, guide.position]
            }
            stroke="#2196F3"
            strokeWidth={1}
            dash={[4, 4]}
          />
        ))}

        {/* Render all shapes */}

        {shapes.map((shape) => (
            <Shape
              key={shape.id}
              {...shape}
              isSelected={shape.id === selectedId}
              onSelect={handleSelect}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              onLineDragEnd={handleLineDragEnd}
              onPointDragEnd={handlePointDragEnd}
            />
          ))}
      </Layer>
    </Stage>
  );
};