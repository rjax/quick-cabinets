import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ComponentShape, Point, SnapConfig, SnapGuide } from './types';

// Union type for all possible shapes
type Shape = ComponentShape;

// State management for the designer application
interface DesignerState {
  shapes: Shape[];              // All shapes in the canvas
  selectedId: string | null;    // Currently selected shape
  snapConfig: SnapConfig;       // Snapping configuration
  snapGuides: SnapGuide[];     // Active alignment guides

  // Actions
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Shape) => void;
  updateLinePoint: (id: string, pointIndex: number, point: Point) => void;
  updateLinePoint2: (id: string, pointIndex: number, point: Point) => void;
  setSelectedId: (id: string | null) => void;
  updateSnapConfig: (updates: Partial<SnapConfig>) => void;
  setSnapGuides: (guides: SnapGuide[]) => void;
  clearSnapGuides: () => void;
}

// Create the store with Zustand
export const useDesignerStore = create<DesignerState>()(devtools((set) => ({
  // Initial state
  shapes: [],
  selectedId: null,
  snapConfig: {
    enabled: true,
    gridSize: 20,
    snapThreshold: 10,
    anchorSnapRadius: 10,
    adjacencyGap: 0,
    showGrid: true,
    mode: 'grid',
    adjacencyMode: 'contact',
  },
  snapGuides: [],

  // Actions
  addShape: (shape) =>
    set((state) => ({ shapes: [...state.shapes, shape] })),

  updateShape: (id, updates) =>
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        shape.id === id ? { ...shape, ...updates } : shape
      ),
    })),

  // Special handling for line points
  updateLinePoint: (id, pointIndex, point) =>
    set((state) => ({
      shapes: state.shapes.map((shape) => {
        if (shape.id === id && shape.type === 'line') {
          const newShape = { ...shape };
          newShape.endPoints[pointIndex] = point;
          return newShape;
        }
        return shape;
      }),
    })),

  updateLinePoint2: (id, pointIndex, point) =>
    set((state) => ({
      shapes: state.shapes.map((shape) => {
        if (shape.id === id && shape.type === 'line') {
          const newShape = { ...shape };
          
          console.log({posx:newShape.x, posy:newShape.y});
          console.log(newShape.endPoints);

          newShape.endPoints[pointIndex] = point;

          newShape.x = Math.min(newShape.endPoints[0].x, newShape.endPoints[1].x);
          newShape.y = Math.min(newShape.endPoints[0].y, newShape.endPoints[1].y);

          console.log({posx:newShape.x, posy:newShape.y});
          console.log(newShape.endPoints);

          const dx = newShape.endPoints[1].x - newShape.endPoints[0].x;
          const dy = newShape.endPoints[1].y - newShape.endPoints[0].y;

          newShape.points = [
            {
              x: dx >= 0 ? 0 : Math.abs(dx),
              y: dy >= 0 ? 0 : Math.abs(dy)
            },
            {
              x: dx >= 0 ? Math.abs(dx) : 0,
              y: dy >= 0 ? Math.abs(dy) : 0
            }
          ];

          return newShape;
        }
        return shape;
      }),
    })),

  setSelectedId: (id) => set({ selectedId: id }),

  updateSnapConfig: (updates) =>
    set((state) => ({
      snapConfig: { ...state.snapConfig, ...updates },
    })),

  setSnapGuides: (guides) => set({ snapGuides: guides }),
  clearSnapGuides: () => set({ snapGuides: [] }),
})));