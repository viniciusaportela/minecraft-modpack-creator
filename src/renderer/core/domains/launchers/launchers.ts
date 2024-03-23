import { existsSync } from 'node:fs';
import { CurseforgeLauncher } from './curseforge/curseforge-launcher';
import { BaseLauncher } from './base/base-launcher';
import BusinessLogicError from '../../errors/business-logic-error';
import { BusinessError } from '../../errors/business-error.enum';
import { MinecraftLauncher } from './minecraft/minecraft-launcher';
import { SKLauncher } from './sklauncher/sk-launcher';

export class Launchers {
  private launchers: BaseLauncher[];

  constructor() {
    this.launchers = Launchers.initializeLaunchers();
  }

  static initializeLaunchers() {
    return [
      new MinecraftLauncher(),
      new CurseforgeLauncher(),
      new SKLauncher(),
    ];
  }

  static async getByFolder(folder: string) {
    const launchers = this.initializeLaunchers();

    for await (const launcher of launchers) {
      if (await launcher.isFolderOfThisLauncher(folder)) {
        return launcher;
      }
    }

    return null;
  }

  static getByName(name: string) {
    const launcherByName = {
      minecraft: MinecraftLauncher,
      curseforge: CurseforgeLauncher,
      sklauncher: SKLauncher,
    };

    return name in launcherByName
      ? new launcherByName[name as keyof typeof launcherByName]()
      : null;
  }

  async getProjectData(folder: string) {
    const exists = existsSync(folder);

    if (!exists) {
      throw new BusinessLogicError({
        code: BusinessError.FolderNotFound,
        message: `Folder "${folder}" doesn't exists`,
      });
    }

    const launcher = await Launchers.getByFolder(folder);

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
