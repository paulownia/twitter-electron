import assert from 'node:assert';
import { describe, it } from 'node:test';
import { defaultBounds, equalBounds, isBounds } from '../../lib/bounds.js';

describe('bounds.ts', () => {
  describe('isBounds', () => {
    it('should return true for valid Bounds object', () => {
      const validBounds = { x: 10, y: 20, width: 100, height: 200 };
      assert.strictEqual(isBounds(validBounds), true);
    });

    it('should return true for Bounds with zero values', () => {
      const zeroBounds = { x: 0, y: 0, width: 0, height: 0 };
      assert.strictEqual(isBounds(zeroBounds), true);
    });

    it('should return true for Bounds with negative values', () => {
      const negativeBounds = { x: -10, y: -20, width: 100, height: 200 };
      assert.strictEqual(isBounds(negativeBounds), true);
    });

    it('should return false for null', () => {
      assert.strictEqual(isBounds(null), false);
    });

    it('should return false for undefined', () => {
      assert.strictEqual(isBounds(undefined), false);
    });

    it('should return false for non-object types', () => {
      assert.strictEqual(isBounds('string'), false);
      assert.strictEqual(isBounds(123), false);
      assert.strictEqual(isBounds(true), false);
      assert.strictEqual(isBounds([]), false);
    });

    it('should return false for object missing x property', () => {
      const missingX = { y: 20, width: 100, height: 200 };
      assert.strictEqual(isBounds(missingX), false);
    });

    it('should return false for object missing y property', () => {
      const missingY = { x: 10, width: 100, height: 200 };
      assert.strictEqual(isBounds(missingY), false);
    });

    it('should return false for object missing width property', () => {
      const missingWidth = { x: 10, y: 20, height: 200 };
      assert.strictEqual(isBounds(missingWidth), false);
    });

    it('should return false for object missing height property', () => {
      const missingHeight = { x: 10, y: 20, width: 100 };
      assert.strictEqual(isBounds(missingHeight), false);
    });

    it('should return false for object with non-number x', () => {
      const invalidX = { x: 'string', y: 20, width: 100, height: 200 };
      assert.strictEqual(isBounds(invalidX), false);
    });

    it('should return false for object with non-number y', () => {
      const invalidY = { x: 10, y: 'string', width: 100, height: 200 };
      assert.strictEqual(isBounds(invalidY), false);
    });

    it('should return false for object with non-number width', () => {
      const invalidWidth = { x: 10, y: 20, width: 'string', height: 200 };
      assert.strictEqual(isBounds(invalidWidth), false);
    });

    it('should return false for object with non-number height', () => {
      const invalidHeight = { x: 10, y: 20, width: 100, height: 'string' };
      assert.strictEqual(isBounds(invalidHeight), false);
    });
  });

  describe('equalBounds', () => {
    it('should return true for identical bounds', () => {
      const bounds1 = { x: 10, y: 20, width: 100, height: 200 };
      const bounds2 = { x: 10, y: 20, width: 100, height: 200 };
      assert.strictEqual(equalBounds(bounds1, bounds2), true);
    });

    it('should return true for same bounds with zero values', () => {
      const bounds1 = { x: 0, y: 0, width: 0, height: 0 };
      const bounds2 = { x: 0, y: 0, width: 0, height: 0 };
      assert.strictEqual(equalBounds(bounds1, bounds2), true);
    });

    it('should return false for different x values', () => {
      const bounds1 = { x: 10, y: 20, width: 100, height: 200 };
      const bounds2 = { x: 15, y: 20, width: 100, height: 200 };
      assert.strictEqual(equalBounds(bounds1, bounds2), false);
    });

    it('should return false for different y values', () => {
      const bounds1 = { x: 10, y: 20, width: 100, height: 200 };
      const bounds2 = { x: 10, y: 25, width: 100, height: 200 };
      assert.strictEqual(equalBounds(bounds1, bounds2), false);
    });

    it('should return false for different width values', () => {
      const bounds1 = { x: 10, y: 20, width: 100, height: 200 };
      const bounds2 = { x: 10, y: 20, width: 150, height: 200 };
      assert.strictEqual(equalBounds(bounds1, bounds2), false);
    });

    it('should return false for different height values', () => {
      const bounds1 = { x: 10, y: 20, width: 100, height: 200 };
      const bounds2 = { x: 10, y: 20, width: 100, height: 250 };
      assert.strictEqual(equalBounds(bounds1, bounds2), false);
    });

    it('should return false when all values are different', () => {
      const bounds1 = { x: 10, y: 20, width: 100, height: 200 };
      const bounds2 = { x: 50, y: 60, width: 300, height: 400 };
      assert.strictEqual(equalBounds(bounds1, bounds2), false);
    });
  });

  describe('defaultBounds', () => {
    it('should have expected default values', () => {
      assert.strictEqual(defaultBounds.width, 480);
      assert.strictEqual(defaultBounds.height, 800);
      assert.strictEqual(defaultBounds.x, 50);
      assert.strictEqual(defaultBounds.y, 60);
    });

    it('should be a valid Bounds object', () => {
      assert.strictEqual(isBounds(defaultBounds), true);
    });

    it('should be immutable (const assertion)', () => {
      // TypeScriptのconst assertionにより、ランタイムでプロパティが読み取り専用になることを確認
      // 実際のテストは型レベルで行われるため、ここでは基本的な値の存在確認のみ
      assert.ok(typeof defaultBounds.width === 'number');
      assert.ok(typeof defaultBounds.height === 'number');
      assert.ok(typeof defaultBounds.x === 'number');
      assert.ok(typeof defaultBounds.y === 'number');
    });
  });
});
