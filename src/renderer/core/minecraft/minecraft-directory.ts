import { readdir } from 'node:fs/promises';
import path from 'path';

export class MinecraftDirectory {
  private readonly modpackFolder: string;

  constructor(modpackFolder: string) {
    this.modpackFolder = modpackFolder;
  }

  async getModJars() {
    const files = await readdir(path.join(this.modpackFolder, 'mods'));
    return files.map((file) => path.join(this.modpackFolder, 'mods', file));
  }
}
