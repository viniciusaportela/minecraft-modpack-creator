import { readdir, stat } from 'node:fs/promises';
import path from 'path';
import os from 'os';
import { BaseLauncher } from '../base/base-launcher';
import { CurseforgeDirectory } from './curseforge-directory';
import { IProject } from '../../../../store/interfaces/project.interface';

let instance: CurseforgeLauncher;

export class CurseforgeLauncher extends BaseLauncher {
  constructor() {
    super();
  }

  static getInstance() {
    if (!instance) {
      instance = new CurseforgeLauncher();
    }

    return instance;
  }

  async genProjectFromFolder(
    folder: string,
  ): Promise<Omit<IProject, 'index'> | null> {
    const directory = this.toDirectory(folder);

    const metadata = await directory.getMetadata();

    return {
      name: metadata?.path.split(path.sep).pop()! ?? directory.getName(),
      path: folder,
      minecraftVersion: metadata?.minecraftVersion ?? 'unknown',
      loaderVersion: metadata?.loaderVersion ?? 'unknown',
      loader: metadata?.modLoader ?? 'unknown',
      launcher: 'curseforge',
      modCount: metadata?.modCount ?? -1,
      isLoaded: false,
      orphan: false,
      lastOpenAt: null,
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
