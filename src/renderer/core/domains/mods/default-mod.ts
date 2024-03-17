import { ModModel } from '../../models/mod.model';
import { ProjectModel } from '../../models/project.model';
import { BaseMod } from './base-mod';

export class DefaultMod extends BaseMod {
  build(project: ProjectModel, mod: ModModel) {}

  preBuild(project: ProjectModel, mod: ModModel) {}

  postBuild(project: ProjectModel, mod: ModModel) {}
}
