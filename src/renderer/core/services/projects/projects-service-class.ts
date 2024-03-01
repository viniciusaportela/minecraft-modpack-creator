import Realm from 'realm';
import { existsSync } from 'node:fs';
import CurseForgeStrategy from './curse-forge.strategy';
import MinecraftStrategy from './minecraft.strategy';
import BusinessLogicError from '../../errors/business-logic-error';

export default class ProjectsServiceClass {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  async createProjectFromFolder(modpackFolder: string) {
    const modpackFolderExists = existsSync(modpackFolder);

    if (!modpackFolderExists) {
      throw new BusinessLogicError({
        status: 'error',
        code: 'folder_not_exists',
        message: `Chosen folder "${modpackFolder}" doesn't exists`,
      });
    }

    const instanceJson = existsSync(`${modpackFolder}/minecraftinstance.json`);

    if (instanceJson) {
      await new CurseForgeStrategy(this.realm).handle(modpackFolder);
    } else {
      await new MinecraftStrategy(this.realm).handle(modpackFolder);
    }
  }
}
