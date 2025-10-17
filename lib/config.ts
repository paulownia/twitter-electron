import { app } from 'electron';
import path from 'path';
import { Config, ConfigKey, ConfigValue } from './config/core.js';

let configInstance: Config | null = null;

export async function initConfig(): Promise<void> {
  if (configInstance) {
    throw new Error('Config is already initialized');
  }
  const configFilePath = path.join(app.getPath('userData'), 'config.json');
  configInstance = new Config(configFilePath);
  await configInstance.load();
}

function getInstance(): Config {
  if (!configInstance) {
    throw new Error('Config is not initialized yet');
  }
  return configInstance;
}

export default {
  get<K extends ConfigKey>(key: K): ConfigValue[K] {
    return getInstance().get(key);
  },
  setAndSave<K extends ConfigKey>(key: K, value: Exclude<ConfigValue[K], undefined>): Promise<void> {
    return getInstance().setAndSave(key, value);
  },
};
