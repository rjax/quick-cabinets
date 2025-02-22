import { Point, Shape, SnapConfig, AnchorPoint, SnapGuide } from '../types';

/**
 * Extracts all possible anchor points from a shape
 * @param shape The shape to get anchor points from
 * @returns Array of anchor points (corners, edges, center)
 */
export function getShapeAnchorPoints(shape: Shape): AnchorPoint[] {
  // Special handling for line shapes
  if (shape.type === 'line') {
    return shape.points.map(point => ({
      x: point.x,
      y: point.y,
      type: 'corner'
    }));
  }

  const points: AnchorPoint[] = [];
  const { x, y, width, height } = shape;

  // Add corner points
  points.push(
    { x, y, type: 'corner' },
    { x: x + width, y, type: 'corner' },
    { x, y: y + height, type: 'corner' },
    { x: x + width, y: y + height, type: 'corner' }
  );

  // Add edge midpoints
  points.push(
    { x: x + width / 2, y, type: 'edge' },
    { x: x + width, y: y + height / 2, type: 'edge' },
    { x: x + width / 2, y: y + height, type: 'edge' },
    { x: x, y: y + height / 2, type: 'edge' }
  );

  // Add center point
  points.push({
    x: x + width / 2,
    y: y + height / 2,
    type: 'center'
  });

  return points;
}

/**
 * Snaps a point to the nearest grid intersection
 * @param point Point to snap
 * @param gridSize Size of the grid
 * @returns Snapped point coordinates
 */
export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Snaps a point to nearby anchor points of other shapes
 * @param point Point to snap
 * @param shapes All shapes to check against
 * @param snapRadius Distance within which snapping occurs
 * @param excludeShapeId ID of shape being moved (to exclude from snapping)
 * @returns Snapped point and alignment guides
 */
export function snapToAnchor(
  point: Point,
  shapes: Shape[],
  snapRadius: number,
  excludeShapeId?: string
): { snappedPoint: Point; guides: SnapGuide[] } {
  let closestDistance = snapRadius;
  let snappedPoint = { ...point };
  const guides: SnapGuide[] = [];

  shapes.forEach(shape => {
    if (shape.id === excludeShapeId) return;

    const anchorPoints = getShapeAnchorPoints(shape);
    anchorPoints.forEach(anchor => {
      const dx = Math.abs(point.x - anchor.x);
      const dy = Math.abs(point.y - anchor.y);

      // Snap to vertical alignment
      if (dx < closestDistance) {
        snappedPoint.x = anchor.x;
        guides.push({ type: 'vertical', position: anchor.x });
      }

      // Snap to horizontal alignment
      if (dy < closestDistance) {
        snappedPoint.y = anchor.y;
        guides.push({ type: 'horizontal', position: anchor.y });
      }
    });
  });

  return { snappedPoint, guides };
}

/**
 * Snaps shapes based on their edges and adjacency
 * @param shape Shape being moved
 * @param shapes Other shapes to check against
 * @param gap Distance to maintain between shapes
 * @param snapThreshold Distance within which snapping occurs
 * @returns Snapped shape and alignment guides
 */
export function snapToAdjacency(
  shape: Shape,
  shapes: Shape[],
  gap: number,
  snapThreshold: number
): { snappedShape: Shape; guides: SnapGuide[] } {
  const guides: SnapGuide[] = [];
  let snappedShape = { ...shape };

  shapes.forEach(otherShape => {
    if (otherShape.id === shape.id) return;

    // Only handle regular shapes (not lines) for adjacency
    if (shape.type !== 'line' && otherShape.type !== 'line') {
      // Check horizontal alignment (top to bottom)
      if (Math.abs(shape.y - (otherShape.y + otherShape.height + gap)) < snapThreshold) {
        snappedShape = { ...snappedShape, y: otherShape.y + otherShape.height + gap };
        guides.push({ type: 'horizontal', position: snappedShape.y });
      }

      // Check vertical alignment (left to right)
      if (Math.abs(shape.x - (otherShape.x + otherShape.width + gap)) < snapThreshold) {
        snappedShape = { ...snappedShape, x: otherShape.x + otherShape.width + gap };
        guides.push({ type: 'vertical', position: snappedShape.x });
      }
    }
  });

  return { snappedShape, guides };
}

/**
 * Main snapping function that applies the current snap mode
 * @param shape Shape being moved
 * @param shapes Other shapes to check against
 * @param config Current snap configuration
 * @returns Snapped shape and alignment guides
 */
export function applySnapping(
  shape: Shape,
  shapes: Shape[],
  config: SnapConfig
): { snappedShape: Shape; guides: SnapGuide[] } {
  if (!config.enabled) return { snappedShape: shape, guides: [] };

  let snappedShape = { ...shape };
  let guides: SnapGuide[] = [];

  switch (config.mode) {
    case 'grid': {
      if (shape.type === 'line') {
        // Snap both points of a line
        const snappedPoints = shape.points.map(p => snapToGrid(p, config.gridSize));
        snappedShape = {
          ...shape,
          points: snappedPoints as [Point, Point]
        };
      } else {
        // Snap shape position to grid
        const snappedPos = snapToGrid({ x: shape.x, y: shape.y }, config.gridSize);
        snappedShape = { ...shape, ...snappedPos };
      }
      break;
    }

    case 'anchor': {
      // Snap to other shapes' anchor points
      const { snappedPoint, guides: anchorGuides } = snapToAnchor(
        { x: shape.x, y: shape.y },
        shapes,
        config.anchorSnapRadius,
        shape.id
      );
      snappedShape = { ...shape, ...snappedPoint };
      guides = anchorGuides;
      break;
    }

    case 'adjacency': {
      // Apply gap based on mode
      const gap = config.adjacencyMode === 'contact' ? 0 : config.adjacencyGap;
      const { snappedShape: adjacencySnapped, guides: adjacencyGuides } = snapToAdjacency(
        shape,
        shapes,
        gap,
        config.snapThreshold
      );
      snappedShape = adjacencySnapped;
      guides = adjacencyGuides;
      break;
    }
  }

  return { snappedShape, guides };
}