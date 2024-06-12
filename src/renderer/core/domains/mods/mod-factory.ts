import ModId from '../../../typings/mod-id.enum';
import { SkillTree } from './skilltree/skill-tree';
import { DefaultMod } from './default-mod';
import { KubeJS } from './kubejs/kubejs';
import { Minecraft } from './minecraft/minecraft';
import { IProject } from '../../../store/interfaces/project.interface';
import { IMod } from '../../../store/interfaces/mods-store.interface';
import { IBaseModConfig } from '../../../store/interfaces/mod-config.interface';

export class ModFactory {
  static create(project: IProject, mod: IMod, modConfig: IBaseModConfig) {
    switch (mod.id) {
      case ModId.PassiveSkillTree:
        return new SkillTree(project, mod, modConfig);
      case ModId.KubeJS:
        return new KubeJS(project, mod, modConfig);
      case ModId.Minecraft:
        return new Minecraft(project, mod, modConfig);
      default:
        return new DefaultMod(project, mod, modConfig);
    }
  }
}
