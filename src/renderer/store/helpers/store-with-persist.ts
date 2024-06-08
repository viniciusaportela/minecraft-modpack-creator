import { proxy, subscribe } from 'valtio';
import { readFile, writeFile } from 'node:fs/promises';
import debounce from 'lodash.debounce';
import { existsSync } from 'node:fs';
import path from 'path';
import { CachedCallbacks } from '../CachedCallbacks';
import { appStore } from '../app-2.store';

export type StoreWithPersist<T> = T & {
  __loaded: boolean;
};

export interface IWithPersistConfig<T> {
  pathGetter: () => Promise<string>;
  initialState: T;
  partialize: (state: T) => Partial<T>;
}

export function storeWithPersist<T extends object = any>({
  pathGetter,
  initialState,
  partialize,
}: IWithPersistConfig<T>): StoreWithPersist<T> {
  const store = proxy<StoreWithPersist<T>>({
    ...initialState,
    __loaded: false,
  });

  const debouncedWrite = debounce(async () => {
    const cachedPath =
      await CachedCallbacks.getInstance().get<string>(pathGetter);
    const partial = partialize(store);
    await writeFile(cachedPath, JSON.stringify(partial), 'utf-8');
  }, 1000);

  subscribe(store, async (state) => {
    await debouncedWrite();
  });

  CachedCallbacks.getInstance()
    .get<string>(pathGetter)
    .then(async (gottenPath) => {
      console.log('gottenPath', gottenPath);
      const exists = existsSync(gottenPath);

      if (!exists) {
        store.__loaded = true;
        return;
      }

      const stored = JSON.parse(await readFile(gottenPath, 'utf-8'));

      console.log('stored', stored);

      for (const [key, item] of Object.entries(stored)) {
        console.log('set', key, 'to', item);
        // @ts-ignore
        appStore[key] = item;
      }

      appStore.__loaded = true;
    })
    .catch((err) => {
      console.error('Failed to get path:', err);
    });

  return store;
}
