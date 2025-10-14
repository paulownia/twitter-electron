import assert from 'node:assert';
import { describe, it } from 'node:test';
import { isValidUserId } from '../../lib/user-id.js';

describe('user-id.ts', () => {
  describe('isValidUserId', () => {
    describe('valid user IDs', () => {
      it('should return true for basic alphanumeric user ID', () => {
        assert.strictEqual(isValidUserId('user123'), true);
      });

      it('should return true for user ID with underscores', () => {
        assert.strictEqual(isValidUserId('user_name'), true);
      });

      it('should return true for user ID starting with underscore', () => {
        assert.strictEqual(isValidUserId('_user'), true);
      });

      it('should return true for user ID ending with underscore', () => {
        assert.strictEqual(isValidUserId('user_'), true);
      });

      it('should return true for user ID with multiple underscores', () => {
        assert.strictEqual(isValidUserId('user__name'), true);
      });

      it('should return true for exactly 3 characters', () => {
        assert.strictEqual(isValidUserId('abc'), true);
      });

      it('should return true for long user ID', () => {
        assert.strictEqual(isValidUserId('verylongusername123456789'), true);
      });

      it('should return true for only numbers', () => {
        assert.strictEqual(isValidUserId('123456'), true);
      });

      it('should return true for only underscores (if 3+ chars)', () => {
        assert.strictEqual(isValidUserId('___'), true);
      });
    });

    describe('invalid user IDs - length', () => {
      it('should return false for empty string', () => {
        assert.strictEqual(isValidUserId(''), false);
      });

      it('should return false for 1 character', () => {
        assert.strictEqual(isValidUserId('a'), false);
      });

      it('should return false for 2 characters', () => {
        assert.strictEqual(isValidUserId('ab'), false);
      });
    });

    describe('invalid user IDs - special characters', () => {
      it('should return false for user ID with hyphen', () => {
        assert.strictEqual(isValidUserId('user-name'), false);
      });

      it('should return false for user ID with space', () => {
        assert.strictEqual(isValidUserId('user name'), false);
      });

      it('should return false for user ID with dot', () => {
        assert.strictEqual(isValidUserId('user.name'), false);
      });

      it('should return false for user ID with special characters', () => {
        assert.strictEqual(isValidUserId('user@name'), false);
        assert.strictEqual(isValidUserId('user#name'), false);
        assert.strictEqual(isValidUserId('user$name'), false);
        assert.strictEqual(isValidUserId('user%name'), false);
      });

      it('should return false for user ID with Unicode characters', () => {
        assert.strictEqual(isValidUserId('userあ'), false);
        assert.strictEqual(isValidUserId('user名前'), false);
      });
    });

    describe('invalid user IDs - reserved words', () => {
      it('should return false for "login"', () => {
        assert.strictEqual(isValidUserId('login'), false);
      });

      it('should return false for "logout"', () => {
        assert.strictEqual(isValidUserId('logout'), false);
      });

      it('should return false for "search"', () => {
        assert.strictEqual(isValidUserId('search'), false);
      });

      it('should return false for "home"', () => {
        assert.strictEqual(isValidUserId('home'), false);
      });

      it('should return false for "notifications"', () => {
        assert.strictEqual(isValidUserId('notifications'), false);
      });

      it('should return false for "messages"', () => {
        assert.strictEqual(isValidUserId('messages'), false);
      });

      it('should return false for "i"', () => {
        assert.strictEqual(isValidUserId('i'), false);
      });

      it('should return false for "settings"', () => {
        assert.strictEqual(isValidUserId('settings'), false);
      });

      it('should return false for "account"', () => {
        assert.strictEqual(isValidUserId('account'), false);
      });

      it('should return false for "explore"', () => {
        assert.strictEqual(isValidUserId('explore'), false);
      });

      it('should return false for "about"', () => {
        assert.strictEqual(isValidUserId('about'), false);
      });

      it('should return false for "help"', () => {
        assert.strictEqual(isValidUserId('help'), false);
      });

      it('should return false for "tos"', () => {
        assert.strictEqual(isValidUserId('tos'), false);
      });

      it('should return false for "privacy"', () => {
        assert.strictEqual(isValidUserId('privacy'), false);
      });

      it('should return false for "jobs"', () => {
        assert.strictEqual(isValidUserId('jobs'), false);
      });

      it('should return false for "download"', () => {
        assert.strictEqual(isValidUserId('download'), false);
      });
    });

    describe('edge cases', () => {
      it('should handle case insensitivity for reserved words', () => {
        // 予約語は大文字小文字を区別しないため、大文字でも無効
        assert.strictEqual(isValidUserId('Login'), false);
        assert.strictEqual(isValidUserId('HOME'), false);
        assert.strictEqual(isValidUserId('Settings'), false);
        assert.strictEqual(isValidUserId('SEARCH'), false);
        assert.strictEqual(isValidUserId('Messages'), false);
      });

      it('should handle mixed case reserved words', () => {
        // 混合ケースの予約語も無効
        assert.strictEqual(isValidUserId('LogIn'), false);
        assert.strictEqual(isValidUserId('Home'), false);
        assert.strictEqual(isValidUserId('NotiFications'), false);
      });

      it('should handle reserved words with numbers/underscores', () => {
        // 予約語と似ているが異なる文字列は有効
        assert.strictEqual(isValidUserId('home123'), true);
        assert.strictEqual(isValidUserId('login_user'), true);
        assert.strictEqual(isValidUserId('user_settings'), true);
      });
    });
  });
});
