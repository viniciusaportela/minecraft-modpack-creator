import { ProjectModel } from '../../models/project.model';
import { ModModel } from '../../models/mod.model';

export abstract class BaseMod {
  constructor(
    protected readonly project: ProjectModel,
    protected readonly mod: ModModel,
  ) {}

  build(project: any, mod: any) {}

  preBuild(project: any, mod: any) {}

  postBuild(project: any, mod: any) {}
}
