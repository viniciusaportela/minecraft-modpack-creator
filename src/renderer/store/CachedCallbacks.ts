import { ipcRenderer } from 'electron';

let instance: CachedCallbacks;

export class CachedCallbacks {
  private cache = new Map<Function, any>();

  static getInstance(): CachedCallbacks {
    if (!instance) {
      instance = new CachedCallbacks();
    }

    return instance;
  }

  public async get<T>(callback: () => Promise<T>): Promise<T> {
    if (!this.cache.has(callback)) {
      this.cache.set(callback, await callback());
    }

    return this.cache.get(callback);
  }
}

export async function UserDataPathCallback() {
  return ipcRenderer.invoke('getPath', 'userData');
}
