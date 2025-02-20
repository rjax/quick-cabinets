import React from 'react';
import { Rect, Circle, Line, Transformer } from 'react-konva';
import { ShapeProps } from '../types';

export const Shape: React.FC<ShapeProps> = ({
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
      case 'line':
        return (
          <Line
            {...shapeProps}
            points={[0, 0, width, 0]}
            stroke="#000"
            strokeWidth={2}
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