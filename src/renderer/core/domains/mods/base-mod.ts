import { ProjectModel } from '../../models/project.model';
import { ModModel } from '../../models/mod.model';
import { ModConfigModel } from '../../models/mod-config.model';

export abstract class BaseMod {
  protected config: ModConfigModel;

  constructor(
    protected readonly project: ProjectModel,
    protected readonly mod: ModModel,
  ) {
    this.config = mod.getConfig();
  }

  build(project: any, mod: any) {}

  preBuild(project: any, mod: any) {}

  postBuild(project: any, mod: any) {}

  initializeConfig(config: any) {
    return { ...config, initialized: true };
  }
}
