import { Launchers } from '../launchers/launchers';
import BusinessLogicError from '../../errors/business-logic-error';
import { BusinessError } from '../../errors/business-error.enum';
import { appStore } from '../../../store/app-2.store';

let instance: ProjectService;

export default class ProjectService {
  private launchers: Launchers;

  constructor() {
    this.launchers = Launchers.getInstance();
  }

  static getInstance() {
    if (!instance) {
      instance = new ProjectService();
    }

    return instance;
  }

  async createFromFolder(folder: string) {
    console.log('create from folder', folder);
    const project = await this.launchers.genProjectFromFolder(folder);

    if (!project) {
      throw new BusinessLogicError({
        message: 'Failed to create project from folder',
        code: BusinessError.FailedToCreateProject,
      });
    }

    const exists = appStore.projects.find((p) => p.path === folder);

    if (exists) {
      exists.modCount = project.modCount;
      exists.loader = project.loader;
      exists.loaderVersion = project.loaderVersion;
      exists.minecraftVersion =
        (project.minecraftVersion === 'unknown'
          ? exists.minecraftVersion
          : project.minecraftVersion) ?? 'unknown';
      exists.orphan = false;

      return;
    }

    appStore.projects.push({
      ...project,
      index: appStore.projects.length,
    });
  }

  async populateProjects() {
    const modpackFolders = await this.launchers.findModpackFolders();

    const promises = modpackFolders.map(async (folder) => {
      await this.createFromFolder(folder);
    });
    await Promise.all(promises);

    const { projects } = appStore;
    const orphanedProjects = projects.filter(
      (p) => !modpackFolders.includes(p.path),
    );

    orphanedProjects.forEach((p) => {
      p.orphan = true;
    });
  }

  selectProject(projectIndex: number) {
    appStore.selectedProjectIndex = projectIndex;
    appStore.selectedProject = appStore.projects[projectIndex];
  }

  unselectProject() {
    appStore.selectedProjectIndex = -1;
    appStore.selectedProject = null;
  }

  async deleteProject(projectIndex: number) {
    const project = appStore.projects[projectIndex];

    if (!project) {
      throw new BusinessLogicError({
        message: 'Invalid project',
        code: BusinessError.InvalidProject,
      });
    }

    if (project.orphan) {
      appStore.projects.splice(projectIndex, 1);
      return;
    }

    project.isLoaded = false;
  }
}
