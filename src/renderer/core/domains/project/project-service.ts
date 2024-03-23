import { useAppStore } from '../../../store/app.store';
import { ProjectModel } from '../../models/project.model';
import { Launchers } from '../launchers/launchers';

export default class ProjectService {
  private launchers: Launchers;

  constructor() {
    this.launchers = new Launchers();
  }

  async createFromFolder(folder: string) {
    const { realm } = useAppStore.getState();

    const data = await this.launchers.getProjectData(folder);

    realm.write(() => {
      const exists = realm
        .objects<ProjectModel>(ProjectModel.schema.name)
        .filtered(`path = "${folder}"`);

      if (exists[0]) {
        exists[0].cachedAmountInstalledMods = data.cachedAmountInstalledMods;
        exists[0].loader = data.loader;
        exists[0].loaderVersion = data.loaderVersion;
        exists[0].minecraftVersion =
          (data.minecraftVersion === 'unknown'
            ? exists[0].minecraftVersion
            : data.minecraftVersion) ?? 'unknown';
        exists[0].orphan = false;
        return;
      }

      realm.create<ProjectModel>(ProjectModel.schema.name, {
        name: data.name,
        path: folder,
        minecraftVersion: data.minecraftVersion,
        loaderVersion: data.loaderVersion,
        loader: data.loader,
        launcher: data.launcher,
        cachedAmountInstalledMods: data.cachedAmountInstalledMods,
      });
    });
  }

  async populateProjects() {
    const { realm } = useAppStore.getState();

    const modpackFolders = await this.launchers.findModpackFolders();
    console.log(modpackFolders);

    const promises = modpackFolders.map(async (folder) => {
      await this.createFromFolder(folder);
    });
    await Promise.all(promises);

    const projects = realm.objects<ProjectModel>('Project');
    const orphanedProjects = projects.filter(
      (p) => !modpackFolders.includes(p.path),
    );

    realm.write(() => {
      orphanedProjects.forEach((p) => {
        p.orphan = true;
      });
    });
  }
}
