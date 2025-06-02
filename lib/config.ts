import { app } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import { log } from './log.js';

let data: Record<string, any> = {};

let changed = false;

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
    log.warn(e);
  }
}

async function save() {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    changed = false;
    await fs.writeFile(configFile, JSON.stringify(data), { encoding: 'utf8' });
  } catch (e) {
    changed = true;
    log.error(e);
  }
}

export const config = {
  init: () => load(),

  flush: () => {
    return changed ? save() : Promise.resolve();
  },

  get: (key: string) => data[key],

  set: (key: string, value: any) => {
    data[key] = value;
    changed = true;
  },

  persist: () => save(),
};
