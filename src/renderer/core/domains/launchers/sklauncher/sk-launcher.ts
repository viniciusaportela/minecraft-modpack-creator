import { readdir } from 'node:fs/promises';
import path from 'path';
import { BaseLauncher, IProjectData } from '../base/base-launcher';
import { SKLauncherDirectory } from './sk-launcher-directory';
import { isUUIDValid } from '../../../../helpers/is-uuid-valid';

export class SKLauncher extends BaseLauncher {
  async findModpackFolders(): Promise<string[]> {
    const minecraftPath = this.getMinecraftPath();

    if (!minecraftPath) {
      return [];
    }

    return readdir(path.join(minecraftPath, 'modpacks')).then((folders) =>
      folders.map((f) => path.join(minecraftPath, 'modpacks', f)),
    );
  }

  getDirectory(folder: string): SKLauncherDirectory {
    return new SKLauncherDirectory(folder);
  }

  async getProjectData(folder: string): Promise<IProjectData> {
    const dir = this.getDirectory(folder);
    const metadata = await dir.readMetadata().then((m) => m.getRaw());

    return {
      name: metadata.name,
      path: folder,
      minecraftVersion: metadata.minecraft.version,
      loaderVersion: metadata.minecraft.modLoaders[0].id,
      loader: metadata.minecraft.modLoaders[0].id,
      cachedAmountInstalledMods: metadata.files.length,
      launcher: 'sklauncher',
    };
  }

  async isFolderOfThisLauncher(folder: string): Promise<boolean> {
    const lastPart = folder.split('/').pop();
    const secondLastPart = folder.split('/').slice(-2, -1)[0];
    console.log('lastPart', lastPart, 'secondLastPart', secondLastPart);

    return secondLastPart === 'modpacks' && isUUIDValid(lastPart as string);
  }
}
