import { readdir } from 'node:fs/promises';
import path from 'path';
import { BaseLauncher } from '../base/base-launcher';
import { SKLauncherDirectory } from './sk-launcher-directory';
import { isUUIDValid } from '../../../../helpers/is-uuid-valid';
import { IProject } from '../../../../store/interfaces/project.interface';

let instance: SKLauncher;

export class SKLauncher extends BaseLauncher {
  static getInstance() {
    if (!instance) {
      instance = new SKLauncher();
    }

    return instance;
  }

  async getModpacksFolders(): Promise<string[]> {
    const minecraftPath = this.getMinecraftRoot();

    if (!minecraftPath) {
      return [];
    }

    return readdir(path.join(minecraftPath, 'modpacks')).then((folders) =>
      folders.map((f) => path.join(minecraftPath, 'modpacks', f)),
    );
  }

  toDirectory(folder: string): SKLauncherDirectory {
    return new SKLauncherDirectory(folder);
  }

  async genProjectFromFolder(
    folder: string,
  ): Promise<Omit<IProject, 'index'> | null> {
    const dir = this.toDirectory(folder);
    const metadata = await dir.getMetadata();

    return {
      name: metadata?.path.split(path.sep).pop() || dir.getName(),
      path: folder,
      minecraftVersion: metadata?.minecraftVersion || 'unknown',
      loaderVersion: metadata?.loaderVersion || 'unknown',
      loader: metadata?.modLoader || 'unknown',
      modCount: metadata?.modCount || -1,
      launcher: 'sklauncher',
      isLoaded: false,
      lastOpenAt: null,
      orphan: false,
    };
  }

  async isFolderOfThisLauncher(folder: string): Promise<boolean> {
    const lastPart = folder.split('/').pop();
    const secondLastPart = folder.split('/').slice(-2, -1)[0];
    console.log('lastPart', lastPart, 'secondLastPart', secondLastPart);

    return secondLastPart === 'modpacks' && isUUIDValid(lastPart as string);
  }
}
