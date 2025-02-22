import { create } from 'zustand';
import { ComponentShape, LineShape, Point, SnapConfig, SnapGuide } from './types';

// Union type for all possible shapes
type Shape = ComponentShape | LineShape;

// State management for the designer application
interface DesignerState {
  shapes: Shape[];              // All shapes in the canvas
  selectedId: string | null;    // Currently selected shape
  snapConfig: SnapConfig;       // Snapping configuration
  snapGuides: SnapGuide[];     // Active alignment guides

  // Actions
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  updateLinePoint: (id: string, pointIndex: number, point: Point) => void;
  setSelectedId: (id: string | null) => void;
  updateSnapConfig: (updates: Partial<SnapConfig>) => void;
  setSnapGuides: (guides: SnapGuide[]) => void;
  clearSnapGuides: () => void;
}

// Create the store with Zustand
export const useDesignerStore = create<DesignerState>((set) => ({
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
          const newPoints = [...(shape as LineShape).points];
          newPoints[pointIndex] = point;
          return { ...shape, points: newPoints };
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
}));