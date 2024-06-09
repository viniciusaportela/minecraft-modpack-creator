import { readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'path';
import { existsSync } from 'node:fs';
import debounce from 'lodash.debounce';
import { CachedCallbacks } from '../cached-callbacks';

const debounceWrite = debounce(
  async (name: string, value: any, dataFolder: string) => {
    console.log('write', JSON.stringify(value, null, 2));
    await writeFile(
      path.join(dataFolder, `${name}.json`),
      JSON.stringify(value),
    );
  },
  1000,
);

export class JsonStorage {
  constructor(
    private readonly basePathGetter: () => any,
    private readonly useCache = true,
  ) {}

  async getItem(name: string) {
    const dataFolder = await this.getBaseFolder();
    const exists = existsSync(path.join(dataFolder, `${name}.json`));

    if (!exists) {
      return null;
    }

    const data = await readFile(path.join(dataFolder, `${name}.json`), 'utf-8');

    return JSON.parse(data);
  }

  async setItem(name: string, value: any) {
    debounceWrite(name, value, await this.getBaseFolder());
  }

  async removeItem(name: string) {
    const dataFolder = await this.getBaseFolder();
    const exists = existsSync(path.join(dataFolder, `${name}.json`));

    if (exists) {
      await unlink(path.join(dataFolder, `${name}.json`));
    }
  }

  async getBaseFolder() {
    return this.useCache
      ? CachedCallbacks.getInstance().get<string>(this.basePathGetter)
      : this.basePathGetter();
  }
}
