'use strict';

const path = require('path');
const fs = require('fs');
const {app} = require('electron');
const log = require('./log');

let config = {};

async function load() {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    const file = await fs.promises.readFile(configFile, {encoding: 'utf8'});
    const json = JSON.parse(file);
    Object.assign(config, json);
  } catch (e) {
    log.warn(e);
  }
}

async function save() {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    await fs.promises.writeFile(configFile, JSON.stringify(config), {encoding: 'utf8'});
  } catch (e) {
    log.error(e);
  }
}

module.exports = exports = Object.freeze({
  initConfig: () => load(),

  get: (key) => config[key],

  set: (key, data) => config[key] = data,

  persist: () => save(),
});
