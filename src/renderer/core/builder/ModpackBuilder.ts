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

    const modsDb = realm
      .objects<ModModel>('Mod')
      .filtered('project = $0', project._id);

    this.onProgressCb?.(0, 'Building mods...', modsDb.length);

    let index = 1;
    for await (const modDb of modsDb) {
      this.onProgressCb?.(
        index,
        `Building ${modDb.modId}... (${index}/${modsDb.length})`,
        modsDb.length,
      );
      const mod = ModFactory.create(project, modDb);
      await mod.preBuild(project, modDb);
      await mod.build(project, modDb);
      await mod.postBuild(project, modDb);
      index += 1;
    }
  }
}
