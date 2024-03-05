import Realm, { Results } from 'realm';
import { readFile } from 'node:fs/promises';
import { RealmObject } from 'realm/dist/Object';
import { IProjectStrategy } from '../interfaces/project-strategy.interface';
import { ProjectModel } from '../../../models/project.model';
import { CURRENT_VERSION } from '../../../../constants/current_version';

export default class CurseForgeStrategy implements IProjectStrategy {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  async createFromFolder(modpackFolder: string) {
    const curseInstanceJson = await readFile(
      `${modpackFolder}/minecraftinstance.json`,
      'utf-8',
    );
    const curseInstance = JSON.parse(curseInstanceJson);

    this.realm.write(() => {
      const exists = this.realm
        .objects<ProjectModel>(ProjectModel.schema.name)
        .filtered(`path = "${modpackFolder}"`);

      if (exists[0]) {
        exists[0].cachedAmountInstalledMods =
          curseInstance.installedAddons.length;
        exists[0].loader = curseInstance.baseModLoader.name;
        exists[0].loaderVersion = curseInstance.baseModLoader.name;
        exists[0].minecraftVersion = curseInstance.gameVersion;
        exists[0].orphan = false;

        return;
      }

      this.realm.create<ProjectModel>(ProjectModel.schema.name, {
        name: curseInstance.name,
        path: modpackFolder,
        minecraftVersion: curseInstance.gameVersion,
        loaderVersion: curseInstance.baseModLoader.name,
        loader: curseInstance.baseModLoader.name,
        source: 'curseforge',
        cachedAmountInstalledMods: curseInstance.installedAddons.length,
        recipes: '[]',
        version: CURRENT_VERSION,
      });
    });
  }
}
