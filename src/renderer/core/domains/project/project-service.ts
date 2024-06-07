import { useAppStore } from '../../../store/app.store';
import { Launchers } from '../launchers/launchers';
import BusinessLogicError from '../../errors/business-logic-error';
import { BusinessError } from '../../errors/business-error.enum';

export default class ProjectService {
  private launchers: Launchers;

  constructor() {
    this.launchers = Launchers.getInstance();
  }

  private static instance: ProjectService;

  getInstance() {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  async createFromFolder(folder: string) {
    const project = await this.launchers.genProjectFromFolder(folder);

    if (!project) {
      throw new BusinessLogicError({
        message: 'Failed to create project from folder',
        code: BusinessError.FailedToCreateProject,
      });
    }

    const exists = useAppStore
      .getState()
      .projects.find((p) => p.path === folder);

    if (exists) {
      exists.modCount = project.modCount;
      exists.loader = project.loader;
      exists.loaderVersion = project.loaderVersion;
      exists.minecraftVersion =
        (project.minecraftVersion === 'unknown'
          ? exists.minecraftVersion
          : project.minecraftVersion) ?? 'unknown';
      exists.orphan = false;

      const updatedProjects = useAppStore.getState().projects.map((p) => {
        if (p.path === folder) {
          return exists;
        }

        return p;
      });

      useAppStore.setState(() => ({
        projects: updatedProjects,
      }));
      return;
    }

    useAppStore.setState((state) => ({
      projects: [...state.projects, project],
    }));
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

    useAppStore.setState(() => ({
      projects,
    }));
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
      useAppStore.setState((state) => ({
        projects: state.projects.filter((p) => p.path !== project.path),
      }));
      return;
    }

    useAppStore.setState((state) => ({
      projects: state.projects.map((p) => {
        if (p.path === project.path) {
          p.isLoaded = false;
          return p;
        }

        return p;
      }),
    }));
  }
}
