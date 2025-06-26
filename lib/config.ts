import { app } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import { log } from './log.js';
import { Bounds } from './bounds.js';

interface ConfigValue {
  'externalBrowser': string | undefined;
  'windowBounds': Bounds | undefined;
}
type ConfigKey = keyof ConfigValue;

const data: { [K in ConfigKey]: ConfigValue[K] } = {
  externalBrowser: undefined,
  windowBounds: undefined,
};

const configFile = path.join(app.getPath('userData'), 'config.json');

async function init() {
  log.info(`Load config file: ${configFile}`);
  try {
    const file = await fs.readFile(configFile, { encoding: 'utf8' });
    if (!file) {
      log.info('config file is empty');
      return;
    }
    log.info(`config loaded: ${file}`);
    const json = JSON.parse(file);
    Object.assign(data, json);
  } catch (e) {
    log.error(e);
  }
}

function get<K extends ConfigKey>(key: K): ConfigValue[K] {
  return data[key];
}

function set<K extends ConfigKey>(key: K, value: Exclude<ConfigValue[K], undefined>): void {
  data[key] = value;
}

function save(): Promise<void> {
  log.info(`Save config file: ${configFile}`);
  return doSerial(doSave);
}

function setAndSave<K extends ConfigKey>(key: K, value: Exclude<ConfigValue[K], undefined>): Promise<void> {
  set(key, value);
  return save();
}

let serialJobs: Promise<void> = Promise.resolve();
let pending = false;

function doSerial(job: () => Promise<void>): Promise<void> {
  serialJobs = serialJobs.then(job).catch((e) => {
    log.error(new Error('Failed to execute serial job', { cause: e }));
  });
  return serialJobs;
}

async function doSave(): Promise<void> {
  if (pending) return Promise.resolve();
  pending = true;
  try {
    return await fs.writeFile(configFile, JSON.stringify(data), { encoding: 'utf8' });
  } finally {
    pending = false;
  }
}


export const config = {
  // VSCodeの参照ジャンプ機能のためにプロパティ名を明示している
  init: init,
  get: get,
  set: set,
  save: save,
  setAndSave: setAndSave,
};
