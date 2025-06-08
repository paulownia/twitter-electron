import { Rectangle } from 'electron';

// alias for Electron's Rectangle type
export type Bounds  = Rectangle;

export function isBounds(value: unknown): value is Bounds {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const maybeBounds = value as Bounds;
  return typeof maybeBounds.x === 'number' &&
         typeof maybeBounds.y === 'number' &&
         typeof maybeBounds.width === 'number' &&
         typeof maybeBounds.height === 'number';
}

export function equalBounds(a: Bounds, b: Bounds): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

export const defaultBounds: Bounds = { width: 480, height: 800, x: 50, y: 60 } as const;
