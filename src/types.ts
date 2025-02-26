
// Core geometry types and interfaces
export interface Point {
  x: number;
  y: number;
}

// Configuration for the snapping system
export interface SnapConfig {
  enabled: boolean;          // Master toggle for snapping functionality
  gridSize: number;         // Size of grid cells in pixels
  snapThreshold: number;    // Distance within which snapping activates
  anchorSnapRadius: number; // Radius for anchor point snapping
  adjacencyGap: number;     // Gap between shapes in adjacency mode
  showGrid: boolean;        // Toggle grid visibility
  mode: 'grid' | 'anchor' | 'adjacency';  // Current snapping mode
  adjacencyMode: 'contact' | 'gap';       // Adjacency behavior mode
}

// Base shape properties
export interface BaseShape {
  id: string;
  type: 'rectangle' | 'line' | 'arc' | 'circle';
  x: number;
  y: number;
  rotation: number;
  draggable: boolean;
}

// Rectangle shape properties
export interface RectangleShape extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
}

// Arc shape properties
export interface ArcShape extends BaseShape {
  type: 'arc';
  width: number;
  height: number;
}

// Circle shape properties
export interface CircleShape extends BaseShape {
  type: 'circle';
  width: number;
  height: number;
}

// Line shape properties
export interface LineShape extends BaseShape {
  type: 'line';
  points: [Point, Point];  // Relative start and end points of the line
  endPoints: [Point, Point]; // Absolute start and end points of the line

}

// Union type for all possible shapes
export type ComponentShape = RectangleShape | ArcShape | CircleShape | LineShape;

// Props for the toolbar component
export interface ToolbarProps {
  onAddShape: (type: ComponentShape['type']) => void;
}

// Props for shape components
export interface ShapeProps extends BaseShape {
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDragStart?: () => void;
}

// Props specific to line shapes
export interface LineProps extends BaseShape{
  id: string;
  points: [Point, Point];
  endPoints: [Point, Point];
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onLineDragEnd: (id: string, pointIndex: number, point: Point) => void;
  onPointDragEnd: (id: string, pointIndex: number, point: Point) => void;
}

// Visual guide for shape alignment
export interface SnapGuide {
  type: 'vertical' | 'horizontal';
  position: number;  // Position in pixels
}

// Points where shapes can snap to each other
export interface AnchorPoint {
  x: number;
  y: number;
  type: 'corner' | 'edge' | 'center';  // Different types of anchor points
}

// Visual indicator for snap points
export interface SnapIndicator {
  x: number;
  y: number;
  type: 'grid' | 'anchor' | 'adjacency';
}

export interface RectangleShapeProps extends ShapeProps {
  type: 'rectangle';
  width: number;
  height: number;
}

export interface ArcShapeProps extends ShapeProps {
  type: 'arc';
  width: number;
  height: number;
}

export interface CircleShapeProps extends ShapeProps {
  type: 'circle';
  width: number;
  height: number;
}

export interface LineShapeProps extends ShapeProps {
  type: 'line';
  points: [Point, Point];
  endPoints: [Point, Point];
  onLineDragEnd: (id: string, pointIndex: number, point: Point) => void;
  onPointDragEnd: (id: string, pointIndex: number, point: Point) => void;
}

export type ComponentShapeProps = RectangleShapeProps | ArcShapeProps | CircleShapeProps | LineShapeProps;

// Type guards
export function isRectangleShapeProps(props: ShapeProps): props is RectangleShapeProps {
  return props.type === 'rectangle';
}

export function isArcShapeProps(props: ShapeProps): props is ArcShapeProps {
  return props.type === 'arc';
}

export function isCircleShapeProps(props: ShapeProps): props is CircleShapeProps {
  return props.type === 'circle';
}

export function isLineShapeProps(props: ShapeProps): props is LineShapeProps {
  return props.type === 'line';
}