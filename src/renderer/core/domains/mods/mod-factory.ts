import ModId from '../../../typings/mod-id.enum';
import { SkillTree } from './skilltree/skill-tree';
import { DefaultMod } from './default';
import { KubeJS } from './kubejs/kubejs';
import { ProjectModel } from '../../models/project.model';
import { ModModel } from '../../models/mod.model';

export class ModFactory {
  static create(project: ProjectModel, mod: ModModel) {
    switch (mod.modId) {
      case ModId.PassiveSkillTree:
        return new SkillTree(project, mod);
      case ModId.KubeJS:
        return new KubeJS(project, mod);
      default:
        return new DefaultMod(project, mod);
    }
  }
}
