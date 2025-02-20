import { create } from 'zustand';
import { ComponentShape } from './types';

interface DesignerState {
  shapes: ComponentShape[];
  selectedId: string | null;
  addShape: (shape: ComponentShape) => void;
  updateShape: (id: string, updates: Partial<ComponentShape>) => void;
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
  setSelectedId: (id) => set({ selectedId: id }),
}));