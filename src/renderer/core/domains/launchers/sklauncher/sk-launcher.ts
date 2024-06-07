import { readdir } from 'node:fs/promises';
import path from 'path';
import { BaseLauncher } from '../base/base-launcher';
import { SKLauncherDirectory } from './sk-launcher-directory';
import { isUUIDValid } from '../../../../helpers/is-uuid-valid';
import { IProject } from '../../../../store/interfaces/project.interface';

export class SKLauncher extends BaseLauncher {
  private static instance: SKLauncher;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SKLauncher();
    }

    return this.instance;
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

  async genProjectFromFolder(folder: string): Promise<IProject | null> {
    const dir = this.toDirectory(folder);
    const metadata = await dir.getMetadata();

    if (!metadata) {
      return null;
    }

    return {
      name: metadata.path.split(path.sep).pop() as string,
      path: folder,
      minecraftVersion: metadata.minecraftVersion,
      loaderVersion: metadata.loaderVersion,
      loader: metadata.modLoader,
      modCount: metadata.modCount,
      launcher: 'sklauncher',
      isLoaded: false,
      index: -1,
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
