'use strict';

const path = require('path');
const fs = require('fs');
const {app} = require('electron');

let config = {};

module.exports.init = function() {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    const file = fs.readFileSync(configFile, {encoding: 'utf8'});
    const json = JSON.parse(file);
    Object.assign(config, json);
    Object.freeze(config);
  } catch (e) {
    process.stderr.write(e.messagei + '\n');
    process.stderr.write(e.stack + '\n');
  }
};

module.exports.get = function(key, defaultObj) {
  return config[key] || defaultObj;
};

module.exports.set = function(key, data) {
  const obj = {};
  Object.assign(obj, config);
  obj[key] = data;
  config = obj;
};

module.exports.save = function() {
  const configFile = path.join(app.getPath('userData'), 'config.json');
  try {
    fs.writeFileSync(configFile, JSON.stringify(config), {encoding: 'utf8'});
  } catch (e) {
    process.stderr.write(e.message + '\n');
    process.stderr.write(e.stack + '\n');
  }
};
