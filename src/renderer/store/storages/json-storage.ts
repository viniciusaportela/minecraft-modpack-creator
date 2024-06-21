import { readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'path';
import { existsSync } from 'node:fs';
import debounce from 'lodash.debounce';
import { CachedCallbacks } from '../cached-callbacks';

export class JsonStorage {
  private debounceWrite: (
    name: string,
    value: any,
    dataFolder: string,
  ) => Promise<void>;

  private cachedExists: boolean | null = null;

  constructor(
    private readonly basePathGetter: () => any,
    private readonly useCache = true,
  ) {
    // @ts-ignore
    this.debounceWrite = debounce(
      async (name: string, value: any, dataFolder: string) => {
        if (this.cachedExists === null) {
          this.cachedExists = existsSync(dataFolder);
        }

        console.log(
          'write',
          path.join(dataFolder, `${name}.json`),
          this.cachedExists,
        );

        if (this.cachedExists) {
          await writeFile(
            path.join(dataFolder, `${name}.json`),
            JSON.stringify(value),
          );
        }
      },
      1000,
    );
  }

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
    this.debounceWrite(name, value, await this.getBaseFolder());
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
