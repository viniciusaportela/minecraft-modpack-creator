import { ProjectModel } from '../../models/project.model';
import { ModModel } from '../../models/mod.model';
import { ModConfigModel } from '../../models/mod-config.model';

export class DefaultMod {
  protected config: ModConfigModel;

  constructor(
    protected readonly project: ProjectModel,
    protected readonly mod: ModModel,
  ) {
    this.config = mod.getConfig();
  }

  async build(project: ProjectModel, mod: ModModel) {}

  async preBuild(project: ProjectModel, mod: ModModel) {}

  async postBuild(project: ProjectModel, mod: ModModel) {}

  initializeConfig(config: any) {
    return { ...config, initialized: true };
  }
}
