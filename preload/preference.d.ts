declare global {
  const api: PreferenceAPI;
}

export interface PreferenceAPI {
  getExternalBrowser: () => Promise<string>;

  setExternalBrowser: (value: string) => Promise<void>;

  getCacheSize: () => Promise<number>;

  clearCache: () => Promise<void>;
}
