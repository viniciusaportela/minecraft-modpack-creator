import { useAppStore } from '../../../store/app.store';
import { IProject } from '../../../store/interfaces/project.interface';

export class ProjectPreloader {
  constructor(private readonly project: IProject) {}

  async preload() {
    this.project.isLoaded = true;
    useAppStore.getState().setProject(this.project);
  }
}
