import { stat } from 'node:fs/promises';
import { BaseLauncher, IProjectData } from '../base/base-launcher';
import { MinecraftDirectory } from './minecraft-directory';

export class MinecraftLauncher extends BaseLauncher {
  async findModpackFolders(): Promise<string[]> {
    const minecraftPath = this.getMinecraftPath();

    if (!minecraftPath) {
      return [];
    }

    const exists = await stat(minecraftPath)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      return [];
    }

    return [minecraftPath];
  }

  getDirectory(folder: string): MinecraftDirectory {
    return new MinecraftDirectory(folder);
  }

  async getProjectData(folder: string): Promise<IProjectData> {
    const modPaths = await this.getDirectory(folder).getAllModPaths();

    return {
      name: 'Minecraft',
      path: folder,
      minecraftVersion: '',
      loaderVersion: '1.0.0',
      loader: 'unknown',
      launcher: 'minecraft',
      cachedAmountInstalledMods: modPaths.length,
    };
  }

  async isFolderOfThisLauncher(folder: string) {
    const pathSplit = folder.split('/');
    const lastFolder = pathSplit[pathSplit.length - 1];
    return lastFolder === '.minecraft';
  }
}
