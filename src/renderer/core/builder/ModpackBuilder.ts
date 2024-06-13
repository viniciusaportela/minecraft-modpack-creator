import { ModFactory } from '../domains/mods/mod-factory';
import { IProject } from '../../store/interfaces/project.interface';
import { useModsStore } from '../../store/mods.store';
import { LazyStoreRegistry } from '../../store/lazy-store-registry';

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

  async build(project: IProject) {
    const { mods } = useModsStore.getState();

    this.onProgressCb?.(0, 'Building mods...', mods.length);

    const modCfgStore = LazyStoreRegistry.getInstance();

    let index = 1;
    for await (const modDb of mods) {
      this.onProgressCb?.(
        index,
        `Building ${modDb.id}... (${index}/${mods.length})`,
        mods.length,
      );
      const mod = ModFactory.create(
        project,
        modDb,
        modCfgStore.get(modDb).getState(),
      );
      await mod.preBuild();
      await mod.build();
      await mod.postBuild();
      index += 1;
    }
  }
}
