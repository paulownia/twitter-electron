'use strict';

import { app } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import { log } from './log.js';

let data = {};

async function load() {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    const file = await fs.readFile(configFile, {encoding: 'utf8'});
    const json = JSON.parse(file);
    Object.assign(data, json);
  } catch (e) {
    log.warn(e);
  }
}

async function save() {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    await fs.writeFile(configFile, JSON.stringify(data), {encoding: 'utf8'});
  } catch (e) {
    log.error(e);
  }
}

export const initConfig = load;

export const config = {
  get: (key) => config[key],

  set: (key, data) => config[key] = data,

  persist: () => save(),
};
