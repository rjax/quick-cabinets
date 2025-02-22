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

// Special case for line shapes which use points instead of width/height
export interface LineShape extends Omit<ComponentShape, 'width' | 'height'> {
  type: 'line';
  points: [Point, Point];  // Start and end points of the line
}

// Props for the toolbar component
export interface ToolbarProps {
  onAddShape: (type: ComponentShape['type']) => void;
}

// Props for shape components
export interface ShapeProps extends ComponentShape {
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

// Props specific to line shapes
export interface LineProps extends Omit<ShapeProps, 'width' | 'height'> {
  points: [Point, Point];
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