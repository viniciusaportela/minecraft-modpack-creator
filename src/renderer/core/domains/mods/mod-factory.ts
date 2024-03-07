import ModId from '../../../typings/mod-id.enum';
import { SkillTree } from './skilltree/skill-tree';
import { DefaultMod } from './default';
import { KubeJS } from './kubejs/kubejs';

export class ModFactory {
  static create(modId: string) {
    switch (modId) {
      case ModId.PassiveSkillTree:
        return SkillTree;
      case ModId.KubeJS:
        return KubeJS;
      default:
        return DefaultMod;
    }
  }
}
