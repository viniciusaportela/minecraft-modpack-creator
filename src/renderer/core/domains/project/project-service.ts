import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import CurseForgeStrategy from './strategies/curse-forge.strategy';
import BusinessLogicError from '../../errors/business-logic-error';
import { useAppStore } from '../../../store/app.store';
import { BusinessError } from '../../errors/business-error.enum';
import getCurseForgeFolder from '../minecraft/helpers/get-curse-forge-folder';

export default class ProjectService {
  static async createFromFolder(modpackFolder: string) {
    const { realm } = useAppStore.getState();
    const modpackFolderExists = existsSync(modpackFolder);

    if (!modpackFolderExists) {
      throw new BusinessLogicError({
        code: BusinessError.FolderNotFound,
        message: `Chosen folder "${modpackFolder}" doesn't exists`,
      });
    }

    const instanceJson = existsSync(`${modpackFolder}/minecraftinstance.json`);

    if (!instanceJson) {
      throw new BusinessLogicError({
        code: BusinessError.InvalidProject,
        message: `Currently only CurseForge modpacks are supported. Please select a valid CurseForge modpack folder.`,
      });
    }

    await new CurseForgeStrategy(realm).createFromFolder(modpackFolder);
  }

  static async populateProjects(force = false) {
    const { realm } = useAppStore.getState();

    const globalState = realm.objects('GlobalState')[0];

    if (!force) {
      if (globalState.hasCheckedForProjects) {
        return;
      }
    }

    const curseFolder = getCurseForgeFolder();

    if (curseFolder) {
      const folders = await readdir(curseFolder);
      const promises = folders.map((f: string) =>
        ProjectService.createFromFolder(`${curseFolder}/${f}`),
      );
      await Promise.all(promises);
    } else {
      console.warn('Curseforge folder not found');
    }

    realm.write(() => {
      globalState.hasCheckedForProjects = true;
    });
  }
}
