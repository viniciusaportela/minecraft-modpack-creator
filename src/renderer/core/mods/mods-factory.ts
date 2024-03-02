import { DefaultMod } from './default-mod';
import { SkillTreeMod } from './skill-tree-mod';
import { IMod } from './interfaces/mod.interface';
import JarLoader from '../minecraft/jar-loader';

export class ModsFactory {
  static create(jarLoader: JarLoader, modId: string): IMod {
    switch (modId) {
      case 'skilltree':
        return new SkillTreeMod(jarLoader, modId);
      default:
        return new DefaultMod(jarLoader, modId);
    }
  }
}
