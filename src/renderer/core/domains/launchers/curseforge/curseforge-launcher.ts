import { readdir, stat } from 'node:fs/promises';
import path from 'path';
import os from 'os';
import { BaseLauncher, IProjectData } from '../base/base-launcher';
import { CurseforgeDirectory } from './curseforge-directory';

export class CurseforgeLauncher extends BaseLauncher {
  constructor() {
    super();
  }

  async getProjectData(folder: string): Promise<IProjectData> {
    const directory = this.getDirectory(folder);

    const curseInstance = await directory
      .readMetadata()
      .then((m) => m.getRaw());

    return {
      name: curseInstance.name,
      path: folder,
      minecraftVersion: curseInstance.gameVersion,
      loaderVersion: curseInstance.baseModLoader.name,
      loader: curseInstance.baseModLoader.name,
      launcher: 'curseforge',
      cachedAmountInstalledMods: curseInstance.installedAddons.length,
    };
  }

  async findModpackFolders(): Promise<string[]> {
    const basePath = this.getModpacksBaseFolder();

    if (!basePath) {
      return Promise.resolve([]);
    }

    const paths = await readdir(basePath);

    return paths.map((p) => path.join(basePath, p));
  }

  private getModpacksBaseFolder() {
    if (process.platform === 'linux') {
      const home = os.homedir();
      return path.join(
        home,
        'Documents',
        'curseforge',
        'minecraft',
        'Instances',
      );
    }

    return null;
  }

  getDirectory(folder: string): CurseforgeDirectory {
    return new CurseforgeDirectory(folder);
  }

  async isFolderOfThisLauncher(folder: string): Promise<boolean> {
    const exists = await stat(path.join(folder, 'minecraftinstance.json'))
      .then(() => true)
      .catch(() => false);

    return exists;
  }
}
