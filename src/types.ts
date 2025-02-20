export interface Point {
  x: number;
  y: number;
}

export interface ComponentShape {
  id: string;
  type: 'rectangle' | 'line' | 'arc';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  draggable: boolean;
}

export interface LineShape extends Omit<ComponentShape, 'width' | 'height'> {
  type: 'line';
  points: [Point, Point];
}

export interface ToolbarProps {
  onAddShape: (type: ComponentShape['type']) => void;
}

export interface ShapeProps extends ComponentShape {
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

export interface LineProps extends Omit<ShapeProps, 'width' | 'height'> {
  points: [Point, Point];
  onPointDragEnd: (id: string, pointIndex: number, point: Point) => void;
}