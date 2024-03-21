import { existsSync } from 'node:fs';
import { CurseforgeLauncher } from './curseforge/curseforge-launcher';
import { BaseLauncher } from './base/base-launcher';
import BusinessLogicError from '../../errors/business-logic-error';
import { BusinessError } from '../../errors/business-error.enum';

export class Launchers {
  private launchers: BaseLauncher[];

  constructor() {
    this.launchers = [
      // new MinecraftLauncher(),
      new CurseforgeLauncher(),
      // new SKLauncher(),
    ];
  }

  async getByFolder(folder: string) {
    for await (const launcher of this.launchers) {
      if (await launcher.isFolderOfThisLauncher(folder)) {
        return launcher;
      }
    }

    return null;
  }

  async getProjectData(folder: string) {
    const exists = existsSync(folder);

    if (!exists) {
      throw new BusinessLogicError({
        code: BusinessError.FolderNotFound,
        message: `Folder "${folder}" doesn't exists`,
      });
    }

    const launcher = await this.getByFolder(folder);

    if (!launcher) {
      throw new BusinessLogicError({
        code: BusinessError.LauncherNotFound,
        message: "The launcher couldn't be identified by the provided folder",
        meta: {
          folder,
        },
      });
    }

    return launcher.getProjectData(folder);
  }

  async findModpackFolders() {
    const folders: string[] = [];

    for await (const launcher of this.launchers) {
      const launcherFolders = await launcher.findModpackFolders();
      folders.push(...launcherFolders);
    }

    return folders;
  }
}
