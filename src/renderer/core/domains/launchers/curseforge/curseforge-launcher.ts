import { readdir, stat } from 'node:fs/promises';
import path from 'path';
import os from 'os';
import { BaseLauncher } from '../base/base-launcher';
import { CurseforgeDirectory } from './curseforge-directory';
import { IProject } from '../../../../store/interfaces/project.interface';

export class CurseforgeLauncher extends BaseLauncher {
  constructor() {
    super();
  }

  private static instance: CurseforgeLauncher;

  static getInstance() {
    if (!this.instance) {
      this.instance = new CurseforgeLauncher();
    }

    return this.instance;
  }

  async genProjectFromFolder(folder: string): Promise<IProject | null> {
    const directory = this.toDirectory(folder);

    const metadata = await directory.getMetadata();

    if (!metadata) {
      return null;
    }

    return {
      name: metadata.path.split(path.sep).pop()!,
      path: folder,
      minecraftVersion: metadata.minecraftVersion,
      loaderVersion: metadata.loaderVersion,
      loader: metadata.modLoader,
      launcher: 'curseforge',
      modCount: metadata.modCount,
      isLoaded: false,
      orphan: false,
      lastOpenAt: null,
      // TODO actual index, or update this later
      index: -1,
    };
  }

  async getModpacksFolders(): Promise<string[]> {
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

    if (process.platform === 'win32') {
      const home = os.homedir();
      return path.join(home, 'curseforge', 'minecraft', 'Instances');
    }

    return null;
  }

  toDirectory(folder: string): CurseforgeDirectory {
    return new CurseforgeDirectory(folder);
  }

  isFolderOfThisLauncher(folder: string): Promise<boolean> {
    return stat(path.join(folder, 'minecraftinstance.json'))
      .then(() => true)
      .catch(() => false);
  }
}
