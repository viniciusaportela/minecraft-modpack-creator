import { existsSync } from 'node:fs';
import { CurseforgeLauncher } from './curseforge/curseforge-launcher';
import BusinessLogicError from '../../errors/business-logic-error';
import { BusinessError } from '../../errors/business-error.enum';
import { SKLauncher } from './sklauncher/sk-launcher';

let instance: Launchers;

export class Launchers {
  static getInstance() {
    if (!instance) {
      instance = new Launchers();
    }

    return instance;
  }

  listLaunchers() {
    return [
      // TODO new MinecraftLauncher(),
      new CurseforgeLauncher(),
      new SKLauncher(),
    ];
  }

  getLauncherByName(name: string) {
    switch (name) {
      case 'curseforge':
        return CurseforgeLauncher.getInstance();
      case 'sklauncher':
        return SKLauncher.getInstance();
      default:
        throw new BusinessLogicError({
          code: BusinessError.LauncherNotFound,
          message: `Launcher "${name}" not found`,
        });
    }
  }

  async getLauncherByFolder(folder: string) {
    const launchers = this.listLaunchers();

    for await (const launcher of launchers) {
      if (await launcher.isFolderOfThisLauncher(folder)) {
        return launcher;
      }
    }

    return null;
  }

  async genProjectFromFolder(folder: string) {
    const exists = existsSync(folder);

    if (!exists) {
      throw new BusinessLogicError({
        code: BusinessError.FolderNotFound,
        message: `Folder "${folder}" doesn't exists`,
      });
    }

    const launcher = await this.getLauncherByFolder(folder);

    if (!launcher) {
      throw new BusinessLogicError({
        code: BusinessError.LauncherNotFound,
        message: "The launcher couldn't be identified by the provided folder",
        meta: {
          folder,
        },
      });
    }

    return launcher.genProjectFromFolder(folder);
  }

  async findModpackFolders() {
    const folders: string[] = [];

    for await (const launcher of this.listLaunchers()) {
      const launcherFolders = await launcher.getModpacksFolders();
      folders.push(...launcherFolders);
    }

    return folders;
  }
}
