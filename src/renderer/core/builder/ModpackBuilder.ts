import { useAppStore } from '../../store/app.store';
import { ModModel } from '../models/mod.model';
import { ModFactory } from '../domains/mods/mod-factory';
import { ProjectModel } from '../models/project.model';

export default class ModpackBuilder {
  private onProgressCb?: (
    progress: number,
    progressText: string,
    totalProgress: number,
  ) => void;

  onProgress(
    onProgress: (
      progress: number,
      progressText: string,
      totalProgress: number,
    ) => void,
  ) {
    this.onProgressCb = onProgress;
    return this;
  }

  async build(project: ProjectModel) {
    const { realm } = useAppStore.getState();

    const mods = realm
      .objects<ModModel>('Mod')
      .filtered('project = $0', project._id);

    this.onProgressCb?.(0, 'Building mods...', mods.length);

    let index = 1;
    for await (const mod of mods) {
      this.onProgressCb?.(
        index,
        `Building ${mod.modId}... (${index}/${mods.length})`,
        mods.length,
      );
      const modClass = ModFactory.create(mod.modId);
      await modClass.preBuild?.(project, mod);
      await modClass.build(project, mod);
      await modClass.postBuild?.(project, mod);
      index += 1;
    }
  }
}
