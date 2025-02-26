import React from 'react';
import Konva from 'konva';
import { Rect, Circle, Transformer } from 'react-konva';
import { RectangleShapeProps, ArcShapeProps, CircleShapeProps, LineShapeProps, Point, ComponentShapeProps } from '../types';
import { Line } from './Line';

export const Shape: React.FC<ComponentShapeProps> = (props) => {
  const {
    id,
    type,
    x,
    y,
    rotation,
    isSelected,
    onSelect,
    onDragEnd,
  } = props;

  const rectRef = React.useRef<Konva.Rect>(null);
  const circleRef = React.useRef<Konva.Circle>(null);
  const transformerRef = React.useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current) {
      if (type === 'rectangle' && rectRef.current) {
        transformerRef.current.nodes([rectRef.current]);
      } else if ((type === 'arc' || type === 'circle') && circleRef.current) {
        transformerRef.current.nodes([circleRef.current]);
      }
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, type]);

  const shapeProps = {
    x,
    y,
    rotation,
    draggable: true,
    onClick: () => onSelect(id),
    onDragEnd: (e: any) => onDragEnd(id, e.target.x(), e.target.y()),
  };

  const renderShape = () => {
    switch (type) {
      case 'rectangle':
        const { width, height } = props as RectangleShapeProps;
        return (
          <Rect
            {...shapeProps}
            width={width}
            height={height}
            ref={rectRef}
            fill="#fff"
            stroke="#000"
            strokeWidth={1}
            strokeScaleEnabled={false}
          />
        );
      case 'arc':
        const arcProps = props as ArcShapeProps;
        return (
          <Circle
            {...shapeProps}
            radius={arcProps.width / 2}
            fill="#fff"
            strokeWidth={1}
            stroke="#000"
          />
        );
      case 'circle':
        const circleProps = props as CircleShapeProps;
        return (
          <Circle
            {...shapeProps}
            ref={circleRef}
            radius={circleProps.width / 2}
            fill="#fff"
            strokeWidth={1}
            stroke="#000"
          />
        );
      case 'line':
        const lineProps = props as LineShapeProps;
        return (
          <Line
            {...lineProps}
            points={lineProps.points}
            id={id}
            rotation={rotation}
            isSelected={isSelected}
            onSelect={onSelect}
            onDragEnd={onDragEnd}
            onLineDragEnd={lineProps.onLineDragEnd}
            onPointDragEnd={lineProps.onPointDragEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && <Transformer ref={transformerRef} />}
    </>
  );
};