'use strict';

const path = require('path');
const fs = require('fs');
const {app} = require('electron');

let config = {};

exports.init = async () => {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    const file = await fs.promises.readFile(configFile, {encoding: 'utf8'});
    const json = JSON.parse(file);
    Object.assign(config, json);
  } catch (e) {
    process.stderr.write(e.messagei + '\n');
    process.stderr.write(e.stack + '\n');
  }
};

exports.get = (key) => config[key];

exports.set = (key, data) => config[key] = data;

exports.save = async () => {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    await fs.promises.writeFile(configFile, JSON.stringify(config), {encoding: 'utf8'});
  } catch (e) {
    process.stderr.write(e.message + '\n');
    process.stderr.write(e.stack + '\n');
  }
};
