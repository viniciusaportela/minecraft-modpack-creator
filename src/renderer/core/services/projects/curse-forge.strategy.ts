import Realm from 'realm';
import { readFile } from 'node:fs/promises';
import { IProjectStrategy } from '../interfaces/project-strategy.interface';
import { ProjectModel } from '../../models/project.model';
import { CURRENT_VERSION } from '../../../constants/current_version';

export default class CurseForgeStrategy implements IProjectStrategy {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  async handle(modpackFolder: string) {
    const curseInstanceJson = await readFile(
      `${modpackFolder}/minecraftinstance.json`,
      'utf-8',
    );
    const curseInstance = JSON.parse(curseInstanceJson);

    this.realm.write(() => {
      const exists = this.realm
        .objects(ProjectModel.schema.name)
        .filtered(`path = "${modpackFolder}"`);

      if (exists[0]) {
        exists[0].amountInstalled = curseInstance.installedAddons.length;
        exists[0].loader = curseInstance.baseModLoader.name;
        exists[0].loaderVersion = curseInstance.baseModLoader.name;
        exists[0].minecraftVersion = curseInstance.gameVersion;

        return;
      }

      this.realm.create(ProjectModel.schema.name, {
        name: curseInstance.name,
        path: modpackFolder,
        minecraftVersion: curseInstance.gameVersion,
        loaderVersion: curseInstance.baseModLoader.name,
        loader: curseInstance.baseModLoader.name,
        fromCurseForge: true,
        amountInstalledMods: curseInstance.installedAddons.length,
        version: CURRENT_VERSION,
      });
    });
  }
}
