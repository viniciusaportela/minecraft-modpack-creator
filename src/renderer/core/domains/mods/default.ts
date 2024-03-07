import { ModModel } from '../../models/mod.model';
import { ProjectModel } from '../../models/project.model';

export class DefaultMod {
  static async build(project: ProjectModel, mod: ModModel) {}

  static async preBuild(project: ProjectModel, mod: ModModel) {}

  static async postBuild(project: ProjectModel, mod: ModModel) {}
}
