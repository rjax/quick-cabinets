import React from 'react';
import { Line as KonvaLine, Circle, Transformer } from 'react-konva';
import { LineProps } from '../types';

export const Line: React.FC<LineProps> = ({
  id,
  points,
  rotation,
  isSelected,
  onSelect,
  onDragEnd,
  onPointDragEnd,
}) => {
  const lineRef = React.useRef(null);
  const transformerRef = React.useRef(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && lineRef.current) {
      transformerRef.current.nodes([lineRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const [p1, p2] = points;

  return (
    <>
      <KonvaLine
        ref={lineRef}
        points={[p1.x, p1.y, p2.x, p2.y]}
        stroke="#000"
        strokeWidth={2}
        hitStrokeWidth={10}
        draggable
        rotation={rotation}
        onClick={() => onSelect(id)}
        onDragMove={(e) => {
          const node = e.target;
          const dx = node.x();
          const dy = node.y();
          
          // Reset position to avoid accumulation
          node.position({ x: 0, y: 0 });
          
          // Update both points
          const newPoints = [
            { x: p1.x + dx, y: p1.y + dy },
            { x: p2.x + dx, y: p2.y + dy }
          ];
          
          onPointDragEnd(id, 0, newPoints[0]);
          onPointDragEnd(id, 1, newPoints[1]);
        }}
      />
      
      {isSelected && (
        <>
          {/* Endpoint anchors */}
          <Circle
            x={p1.x}
            y={p1.y}
            radius={6}
            fill="#fff"
            stroke="#000"
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              const point = { x: e.target.x(), y: e.target.y() };
              onPointDragEnd(id, 0, point);
            }}
            onMouseEnter={(e) => {
              const stage = e.target.getStage();
              if (stage) stage.container().style.cursor = 'pointer';
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage();
              if (stage) stage.container().style.cursor = 'default';
            }}
          />
          <Circle
            x={p2.x}
            y={p2.y}
            radius={6}
            fill="#fff"
            stroke="#000"
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              const point = { x: e.target.x(), y: e.target.y() };
              onPointDragEnd(id, 1, point);
            }}
            onMouseEnter={(e) => {
              const stage = e.target.getStage();
              if (stage) stage.container().style.cursor = 'pointer';
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage();
              if (stage) stage.container().style.cursor = 'default';
            }}
          />
          <Transformer
            ref={transformerRef}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            boundBoxFunc={(oldBox, newBox) => {
              // Preserve line length during rotation
              return oldBox;
            }}
            enabledAnchors={[]} // Hide resize anchors
            padding={10}
          />
        </>
      )}
    </>
  );
};