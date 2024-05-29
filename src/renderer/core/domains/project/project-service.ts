import { Types } from 'realm';
import { useAppStore } from '../../../store/app.store';
import { ProjectModel } from '../../models/project.model';
import { Launchers } from '../launchers/launchers';
import { TextureModel } from '../../models/texture.model';
import { BlockModel } from '../../models/block.model';
import { ItemModel } from '../../models/item.model';
import { ModConfigModel } from '../../models/mod-config.model';
import { ModModel } from '../../models/mod.model';

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
        .filtered(`path = $0`, folder);

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

  async deleteProject(projectId: Types.ObjectId) {
    const { realm } = useAppStore.getState();
    try {
      realm.beginTransaction();
      const project = realm.objectForPrimaryKey<ProjectModel>(
        ProjectModel,
        projectId,
      );

      if (!project) {
        throw new Error('Project not found');
      }

      const textures = realm
        .objects(TextureModel.schema.name)
        .filtered(`project = $0`, projectId);
      realm.delete(textures);

      const blocks = realm
        .objects(BlockModel.schema.name)
        .filtered(`project = $0`, projectId);
      realm.delete(blocks);

      const items = realm
        .objects(ItemModel.schema.name)
        .filtered(`project = $0`, projectId);
      realm.delete(items);

      const mods = realm
        .objects(ModModel.schema.name)
        .filtered(`project = $0`, projectId);

      for (const mod of mods) {
        const modConfigs = realm
          .objects(ModConfigModel.schema.name)
          .filtered(`mod = $0`, mod._id);
        realm.delete(modConfigs);
      }

      realm.delete(mods);

      project.loaded = false;

      if (project.orphan) {
        realm.delete(project);
      }

      realm.commitTransaction();
    } catch (e) {
      if (realm.isInTransaction) {
        realm.cancelTransaction();
      }
      throw e;
    }
  }
}
