import Realm from 'realm';
import { useAppStore } from '../../../store/app.store';
import { BaseLauncher } from '../launchers/base/base-launcher';
import { IProject } from '../../../store/interfaces/project.interface';

export class ProjectPreloader {
  private onProgressCb?: (progress: {
    totalProgress?: number;
    text?: string;
  }) => void;

  private readonly realm: Realm;

  private launcher!: BaseLauncher;

  constructor(private readonly project: IProject) {
    const { realm } = useAppStore.getState();
    this.realm = realm;
  }

  onProgress(
    cb: (progress: { totalProgress?: number; text?: string }) => void,
  ) {
    this.onProgressCb = cb;
    return this;
  }

  async preload() {
    this.project.isLoaded = true;
    useAppStore.getState().setProject(this.project);
  }
}
