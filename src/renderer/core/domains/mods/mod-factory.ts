import ModId from '../../../typings/mod-id.enum';
import { SkillTree } from './skilltree/skill-tree';
import { DefaultMod } from './default-mod';
import { KubeJS } from './kubejs/kubejs';
import { ProjectModel } from '../../models/project.model';
import { ModModel } from '../../models/mod.model';
import { Minecraft } from './minecraft/minecraft';

export class ModFactory {
  static create(project: ProjectModel, mod: ModModel) {
    switch (mod.modId) {
      case ModId.PassiveSkillTree:
        return new SkillTree(project, mod);
      case ModId.KubeJS:
        return new KubeJS(project, mod);
      case ModId.Minecraft:
        return new Minecraft(project, mod);
      default:
        return new DefaultMod(project, mod);
    }
  }
}
