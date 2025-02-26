import React from 'react';
import { Line as KonvaLine, Circle, Transformer } from 'react-konva';
import { LineProps } from '../types';
import Konva from 'konva';

export const Line: React.FC<LineProps> = ({
  id,
  x,
  y,
  points,
  endPoints,
  rotation,
  isSelected,
  onSelect,
  onDragEnd,
  onLineDragEnd,
  onPointDragEnd,
}) => {
  const lineRef = React.useRef<Konva.Line>(null);
  const transformerRef = React.useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && lineRef.current) {
      transformerRef.current.nodes([lineRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const [p1, p2] = points;
  console.log({points});

  //   const updateLine = () => {
  //     const origin = {
  //         x: Math.min(startCircle.x(), endCircle.x()),
  //         y: Math.min(startCircle.y(), endCircle.y())
  //     };

  //     const dx = endCircle.x() - startCircle.x();
  //     const dy = endCircle.y() - startCircle.y();

  //     line.position(origin);
  //     line.points([
  //         dx >= 0 ? 0 : Math.abs(dx),
  //         dy >= 0 ? 0 : Math.abs(dy),
  //         dx >= 0 ? Math.abs(dx) : 0,
  //         dy >= 0 ? Math.abs(dy) : 0
  //     ]);

  //     layer.draw();
  // };


  return (
    <>
      <KonvaLine
        ref={lineRef}
        x={x}
        y={y}
        points={[p1.x, p1.y, p2.x, p2.y]}
        stroke="#000"
        strokeWidth={2}
        hitStrokeWidth={10}
        draggable
        rotation={rotation}
        onClick={() => onSelect(id)}
        onDragMove={(e) => {

          const linePos = e.target.position();
          const points = e.target.attrs.points;

          const endPoints = [
            {
              x: points[0] + linePos.x,
              y: points[1] + linePos.y
            },
            {
              x: points[2] + linePos.x,
              y: points[3] + linePos.y
            }];

          onLineDragEnd(id, 0, endPoints[0]);
          onLineDragEnd(id, 1, endPoints[1]);
          onDragEnd(id, e.target.x(), e.target.y());
          return;

        }}
        onDragEnd={(e) => {
          const node = e.target;
          onDragEnd(id, node.x(), node.y());
        }}
      />

      {isSelected && (
        <>
          {/* Endpoint anchors */}
          <Circle
            x={endPoints[0].x}
            y={endPoints[0].y}
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
            x={endPoints[1].x}
            y={endPoints[1].y}
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
          {/* <Transformer
            ref={transformerRef}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            boundBoxFunc={(oldBox) => {
              // Preserve line length during rotation
              return oldBox;
            }}
            enabledAnchors={[]} // Hide resize anchors
            padding={10}
          /> */}
        </>
      )}
    </>
  );
};