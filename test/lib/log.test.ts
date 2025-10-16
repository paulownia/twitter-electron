import assert from 'node:assert';
import { describe, it } from 'node:test';
import { getLogger, initLogger } from '../../lib/log.js';

describe('log.ts', () => {
  describe('getLogger', () => {
    it('should return logger object', () => {
      const logger = getLogger();
      assert.strictEqual(typeof logger.error, 'function');
      assert.strictEqual(typeof logger.warn, 'function');
      assert.strictEqual(typeof logger.info, 'function');
    });

    it('should return same logger instance', () => {
      const logger1 = getLogger();
      const logger2 = getLogger();
      assert.strictEqual(logger1, logger2);
    });
  });

  describe('initLogger - development mode (isPackaged: false)', () => {
    it('should log Error object with stack trace', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const app = { isPackaged: false };
      initLogger(app);

      const error = new Error('Test error');
      const logger = getLogger();
      logger.error(error);

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^E\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\tError: Test error\n/);
      assert.match(stderrOutput[0], /at /); // スタックトレースが含まれている
    });

    it('should log string error message', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.error('Simple error message');

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^E\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\tSimple error message\n$/);
    });

    it('should log unknown error with prefix for number', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.error(123);

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^E\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\tUnknown error: 123\n$/);
    });

    it('should log object as unknown error', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.error({ code: 'ERR', message: 'test' });

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^E\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\tUnknown error: \[object Object\]\n$/);
    });

    it('should log null as unknown error', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.error(null);

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^E\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\tUnknown error: null\n$/);
    });

    it('should log undefined as unknown error', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.error(undefined);

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^E\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\tUnknown error: undefined\n$/);
    });

    it('should log warning message', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.warn('Warning message');

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^W\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\tWarning message\n$/);
    });

    it('should log empty warning message', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.warn('');

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^W\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\t\n$/);
    });

    it('should log info message in development mode', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.info('Info message');

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^I\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\tInfo message\n$/);
    });

    it('should output with correct level prefix', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.error('error');
      logger.warn('warn');
      logger.info('info');

      assert.strictEqual(stderrOutput.length, 3);
      assert.match(stderrOutput[0], /^E\t/);
      assert.match(stderrOutput[1], /^W\t/);
      assert.match(stderrOutput[2], /^I\t/);
    });

    it('should output with ISO 8601 timestamp format', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.warn('test');

      // ISO 8601形式: YYYY-MM-DDTHH:MM:SS±HH:MM
      assert.match(stderrOutput[0], /^\w\t\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}\t.*\n$/);
    });

    it('should end with newline', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.warn('test');

      assert.strictEqual(stderrOutput[0].endsWith('\n'), true);
    });

    it('should handle multiline error messages', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.error('Line 1\nLine 2\nLine 3');

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /Line 1\nLine 2\nLine 3/);
    });

    it('should handle Error with custom name', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const error = new Error('Custom error');
      error.name = 'CustomError';
      const logger = getLogger();
      logger.error(error);

      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^E\t.*\tCustomError: Custom error\n/);
    });

    it('should freeze logger object after initialization', () => {
      const logger = getLogger();
      assert.strictEqual(Object.isFrozen(logger), true);
    });
  });

  describe('initLogger - production mode (isPackaged: true)', () => {
    it('should warn and not reinitialize when already initialized', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      // 既に開発モードで初期化済み
      // 本番モードで再初期化を試みる
      const app = { isPackaged: true };
      initLogger(app);

      // 警告のみが出力される
      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^W\t.*\tLogger already initialized\n$/);
    });

    it('should keep original behavior after failed reinitialization', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      const logger = getLogger();
      logger.error('Error message');
      logger.warn('Warn message');
      logger.info('Info message'); // 開発モードで初期化されているため出力される

      assert.strictEqual(stderrOutput.length, 3);
      assert.match(stderrOutput[0], /^E\t.*\tError message\n$/);
      assert.match(stderrOutput[1], /^W\t.*\tWarn message\n$/);
      assert.match(stderrOutput[2], /^I\t.*\tInfo message\n$/);
    });
  });

  describe('initLogger - multiple initialization', () => {
    it('should warn when initialized multiple times', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      // 既に初期化済み（前のテストで初期化されている）
      const app = { isPackaged: false };
      initLogger(app);

      // 警告メッセージが出力される
      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^W\t.*\tLogger already initialized\n$/);
    });

    it('should not change logger behavior after second initialization', (t) => {
      const stderrOutput: string[] = [];
      t.mock.method(process.stderr, 'write', (chunk: string) => {
        stderrOutput.push(chunk);
        return true;
      });

      // 本番モードで再初期化を試みる
      const app = { isPackaged: true };
      initLogger(app);

      const logger = getLogger();
      stderrOutput.length = 0; // 警告メッセージをクリア

      // 開発モードで初期化されているため、infoログは出力される
      logger.info('Info message');
      assert.strictEqual(stderrOutput.length, 1);
      assert.match(stderrOutput[0], /^I\t.*\tInfo message\n$/);
    });
  });
});
