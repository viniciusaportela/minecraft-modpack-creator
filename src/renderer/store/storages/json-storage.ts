import { readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'path';
import { existsSync } from 'node:fs';
import { CachedCallbacks } from '../CachedCallbacks';

export class JsonStorage {
  constructor(private readonly basePathGetter: () => any) {}

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
    const dataFolder = await this.getBaseFolder();
    await writeFile(
      path.join(dataFolder, `${name}.json`),
      JSON.stringify(value),
    );
  }

  async removeItem(name: string) {
    const dataFolder = await this.getBaseFolder();
    const exists = existsSync(path.join(dataFolder, `${name}.json`));

    if (exists) {
      await unlink(path.join(dataFolder, `${name}.json`));
    }
  }

  async getBaseFolder() {
    return CachedCallbacks.getInstance().get<string>(this.basePathGetter);
  }
}
