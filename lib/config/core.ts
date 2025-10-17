import fs from 'fs/promises';
import { Bounds } from '../bounds.js';
import { Browser } from '../browser.js';
import { getLogger } from '../log.js';

const log = getLogger();

export interface ConfigValue {
  externalBrowser: Browser | undefined;
  windowBounds: Bounds | undefined;
}
export type ConfigKey = keyof ConfigValue;

export class Config {
  #configFilePath: string;

  #data: { [K in ConfigKey]: ConfigValue[K] } = {
    externalBrowser: undefined,
    windowBounds: undefined,
  };

  constructor(configFilePath: string) {
    this.#configFilePath = configFilePath;
  }

  get<K extends ConfigKey>(key: K): ConfigValue[K] {
    return this.#data[key];
  }

  set<K extends ConfigKey>(key: K, value: Exclude<ConfigValue[K], undefined>): void {
    this.#data[key] = value;
  }

  save(): Promise<void> {
    return execJobSerial(() => saveConfig(this.#configFilePath, this.#data));
  }

  setAndSave<K extends ConfigKey>(key: K, value: Exclude<ConfigValue[K], undefined>): Promise<void> {
    this.set(key, value);
    return this.save();
  }

  load(): Promise<void> {
    return loadConfig(this.#configFilePath, this.#data);
  }
};

let serialJobs: Promise<void> = Promise.resolve();

function execJobSerial(job: () => Promise<void>): Promise<void> {
  serialJobs = serialJobs.then(job).catch((e) => {
    log.error(new Error('Failed to execute serial job', { cause: e }));
  });
  return serialJobs;
}

function saveConfig(configFilePath: string, data: ConfigValue): Promise<void> {
  return fs.writeFile(configFilePath, JSON.stringify(data), { encoding: 'utf8' });
}

async function loadConfig(configFilePath: string, data: ConfigValue): Promise<void> {
  log.info(`Load config file: ${configFilePath}`);
  try {
    const file = await fs.readFile(configFilePath, { encoding: 'utf8' });
    if (!file) {
      log.info('config file is empty');
      return;
    }
    // 現状問題はないが、将来の変更で機密情報が出てしまう恐れもある。
    // infoログが本番で出力しない間はOK、もし本番でもinfoログ出したくなったらdebugログレベルに変更すること
    log.info(`config loaded: ${file}`);
    const json = JSON.parse(file);
    Object.assign(data, json);
  } catch (e) {
    if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') {
      log.info('Config file not found, using defaults');
    } else {
      log.error(new Error('Failed to load config', { cause: e }));
    }
  }
}
