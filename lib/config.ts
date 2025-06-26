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

async function load() {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  log.info(`config file: ${configFile}`);
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

async function save() {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    await fs.writeFile(configFile, JSON.stringify(data), { encoding: 'utf8' });
  } catch (e) {
    log.error(e);
  }
}

export const config = {
  init: () => load(),

  get: <K extends ConfigKey>(key: K): ConfigValue[K] => data[key],

  set: <K extends ConfigKey>(key: K, value: Exclude<ConfigValue[K], undefined>) => {
    data[key] = value;
  },

  save: () => save(),

  setAndSave: <K extends ConfigKey>(key: K, value: Exclude<ConfigValue[K], undefined>) => {
    data[key] = value;
    return save();
  },
};
