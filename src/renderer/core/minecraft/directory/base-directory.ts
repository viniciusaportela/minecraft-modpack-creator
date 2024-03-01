import { readdir } from 'node:fs/promises';
import path from 'path';

export abstract class BaseDirectory {
  protected readonly modpackFolder: string;

  constructor(modpackFolder: string) {
    this.modpackFolder = modpackFolder;
  }

  async getModJarPaths() {
    const files = await readdir(path.join(this.modpackFolder, 'mods'));
    return files.map((file) => path.join(this.modpackFolder, 'mods', file));
  }

  abstract getMinecraftJarPath(): Promise<string>;
}
