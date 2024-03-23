import { readdir } from 'node:fs/promises';
import path from 'path';
import { BaseMetadata } from './base-metadata';

export abstract class BaseDirectory {
  readonly modpackFolder: string;

  constructor(modpackFolder: string) {
    this.modpackFolder = modpackFolder;
  }

  async getAllModPaths() {
    return this.getAllFilesFromFolder(path.join(this.modpackFolder, 'mods'));
  }

  abstract getMinecraftJarPath(): Promise<string>;

  abstract readMetadata(): Promise<BaseMetadata>;

  async getAllFilesFromFolder(folder: string): Promise<string[]> {
    const files = await readdir(folder, {
      withFileTypes: true,
    });

    const filesOnly = files.filter((file) => file.isFile());

    return filesOnly.map((file) => path.join(folder, file.name));
  }
}
