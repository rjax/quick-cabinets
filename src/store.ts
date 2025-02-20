import { create } from 'zustand';
import { ComponentShape, LineShape, Point } from './types';

type Shape = ComponentShape | LineShape;

interface DesignerState {
  shapes: Shape[];
  selectedId: string | null;
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  updateLinePoint: (id: string, pointIndex: number, point: Point) => void;
  setSelectedId: (id: string | null) => void;
}

export const useDesignerStore = create<DesignerState>((set) => ({
  shapes: [],
  selectedId: null,
  addShape: (shape) => 
    set((state) => ({ shapes: [...state.shapes, shape] })),
  updateShape: (id, updates) =>
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        shape.id === id ? { ...shape, ...updates } : shape
      ),
    })),
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
}));