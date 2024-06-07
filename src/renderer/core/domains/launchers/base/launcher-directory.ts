import { readdir, readFile } from 'node:fs/promises';
import path from 'path';
import { existsSync } from 'node:fs';
import { IMetadata } from '../../../../store/interfaces/metadata-store.interface';

export abstract class LauncherDirectory {
  readonly modpackFolder: string;

  constructor(modpackFolder: string) {
    this.modpackFolder = modpackFolder;
  }

  getModsPath() {
    return path.join(this.modpackFolder, 'mods');
  }

  async getAllModsPaths() {
    return this.getAllFilesFromFolder(this.getModsPath());
  }

  async getMetadata(): Promise<IMetadata | null> {
    const metadataPath = path.join(this.getDataRootPath(), 'metadata.json');

    const exists = existsSync(metadataPath);

    if (!exists) {
      return null;
    }

    return readFile(metadataPath, 'utf-8').then((data) => JSON.parse(data));
  }

  getDataRootPath() {
    return path.join(this.modpackFolder, 'minecraft-toolkit');
  }

  abstract getMinecraftJarPath(): Promise<string | null>;

  async getAllFilesFromFolder(folder: string): Promise<string[]> {
    const files = await readdir(folder, {
      withFileTypes: true,
    });

    const filesOnly = files.filter((file) => file.isFile());

    return filesOnly.map((file) => path.join(folder, file.name));
  }
}
