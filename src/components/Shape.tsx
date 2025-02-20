import React from 'react';
import { Rect, Circle, Transformer } from 'react-konva';
import { ShapeProps } from '../types';
import { Line } from './Line';

export const Shape: React.FC<ShapeProps & { onPointDragEnd?: any }> = ({
  id,
  type,
  x,
  y,
  width,
  height,
  rotation,
  isSelected,
  onSelect,
  onDragEnd,
  onPointDragEnd,
  ...props
}) => {
  const shapeRef = React.useRef(null);
  const transformerRef = React.useRef(null);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const shapeProps = {
    x,
    y,
    width,
    height,
    rotation,
    draggable: true,
    onClick: () => onSelect(id),
    onDragEnd: (e: any) => onDragEnd(id, e.target.x(), e.target.y()),
    ref: shapeRef,
  };

  if (type === 'line' && 'points' in props) {
    return (
      <Line
        {...props}
        id={id}
        type={type}
        x={x}
        y={y}
        rotation={rotation}
        isSelected={isSelected}
        onSelect={onSelect}
        onDragEnd={onDragEnd}
        onPointDragEnd={onPointDragEnd}
      />
    );
  }

  const renderShape = () => {
    switch (type) {
      case 'rectangle':
        return <Rect {...shapeProps} fill="#fff" stroke="#000" />;
      case 'arc':
        return (
          <Circle
            {...shapeProps}
            radius={width / 2}
            fill="#fff"
            stroke="#000"
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