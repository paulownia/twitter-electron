import fs from 'fs/promises';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import os from 'os';
import path from 'path';
import { Config } from '../../lib/config/core.js';
import { initLogger } from '../../lib/log.js';

describe('config.ts', () => {
  let number = 0;
  let tmpDir: string;
  before(async () => {
    // ロガーを初期化（テスト用）
    initLogger({ isPackaged: false });

    // テスト用のtmpディレクトリを作成
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-config-')).then(dir => dir);
  });
  after(async () => {
    // テスト用のtmpディレクトリを削除
    if (tmpDir) {
      await fs.rm(tmpDir, { recursive: true });
    }
  });

  it('should get and set', () => {
    const configFilePath = path.join(tmpDir, `config-${number++}.json`);
    const config = new Config(configFilePath);

    assert.strictEqual(config.get('externalBrowser'), undefined);
    assert.strictEqual(config.get('windowBounds'), undefined);

    config.set('externalBrowser', 'chrome');
    assert.strictEqual(config.get('externalBrowser'), 'chrome');

    const bounds = { x: 10, y: 20, width: 800, height: 600 };
    config.set('windowBounds', bounds);
    assert.deepStrictEqual(config.get('windowBounds'), bounds);
  });

  it('should be loaded config.json', async () => {
    const configFilePath = path.join(tmpDir, `config-${number++}.json`);

    const data = {
      externalBrowser: 'firefox',
      windowBounds: { x: 10, y: 20, width: 800, height: 600 },
    };
    await fs.writeFile(configFilePath, JSON.stringify(data), { encoding: 'utf8' });

    const config = new Config(configFilePath);
    await config.load();

    assert.strictEqual(config.get('externalBrowser'), 'firefox');
    assert.deepStrictEqual(config.get('windowBounds'), { x: 10, y: 20, width: 800, height: 600 });
  });

  it('should handle non-existent config.json', async () => {
    const configFilePath = path.join(tmpDir, `config-${number++}.json`);

    const config = new Config(configFilePath);
    await config.load();  // ファイルが無くてもエラーにならない

    assert.strictEqual(config.get('externalBrowser'), undefined);
    assert.strictEqual(config.get('windowBounds'), undefined);
  });

  it('should handle empty config.json', async () => {
    const configFilePath = path.join(tmpDir, `config-${number++}.json`);

    await fs.writeFile(configFilePath, '', { encoding: 'utf8' });
    const config = new Config(configFilePath);
    await config.load();  // 空ファイルでもエラーにならない

    assert.strictEqual(config.get('externalBrowser'), undefined);
    assert.strictEqual(config.get('windowBounds'), undefined);
  });
});
