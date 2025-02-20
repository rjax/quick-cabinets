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

export interface ToolbarProps {
  onAddShape: (type: ComponentShape['type']) => void;
}

export interface ShapeProps extends ComponentShape {
  isSelected: boolean;
  onSelect: (id: string) => void;
}