import { Launchers } from '../launchers/launchers';
import BusinessLogicError from '../../errors/business-logic-error';
import { BusinessError } from '../../errors/business-error.enum';
import { useAppStore } from '../../../store/app.store';

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

    const existsIndex = useAppStore
      .getState()
      .projects.findIndex((p) => p.path === folder);

    if (existsIndex !== -1) {
      useAppStore.setState((st) => {
        const exists = st.projects[existsIndex];

        exists.modCount = project.modCount;
        exists.loader = project.loader;
        exists.loaderVersion = project.loaderVersion;
        exists.minecraftVersion =
          (project.minecraftVersion === 'unknown'
            ? exists.minecraftVersion
            : project.minecraftVersion) ?? 'unknown';
        exists.orphan = false;
      });

      return;
    }

    useAppStore.setState((st) => {
      st.projects.push({
        ...project,
        index: st.projects.length,
      });
    });
  }

  async populateProjects() {
    const modpackFolders = await this.launchers.findModpackFolders();

    const promises = modpackFolders.map(async (folder) => {
      await this.createFromFolder(folder);
    });
    await Promise.all(promises);

    const { projects } = useAppStore.getState();
    const orphanedProjects = projects.filter(
      (p) => !modpackFolders.includes(p.path),
    );

    orphanedProjects.forEach((p) => {
      p.orphan = true;
    });
  }

  selectProject(projectIndex: number) {
    useAppStore.setState((st) => {
      console.log('change index', projectIndex);
      st.selectedProjectIndex = projectIndex;
    });
  }

  unselectProject() {
    useAppStore.setState((st) => {
      st.selectedProjectIndex = -1;
    });
  }

  async deleteProject(projectIndex: number) {
    const project = useAppStore.getState().projects[projectIndex];

    if (!project) {
      throw new BusinessLogicError({
        message: 'Invalid project',
        code: BusinessError.InvalidProject,
      });
    }

    if (project.orphan) {
      useAppStore.setState((st) => {
        st.projects.splice(projectIndex, 1);
      });
      return;
    }

    useAppStore.setState((st) => {
      st.projects[projectIndex].isLoaded = false;
    });
  }
}
