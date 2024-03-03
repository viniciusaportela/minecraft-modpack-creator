import { DefaultMod } from './default-mod';
import { SkillTreeMod } from './skill-tree-mod';
import { IMod } from './interfaces/mod.interface';
import JarLoader from '../domains/minecraft/jar-loader';
import { MinecraftMod } from './minecraft-mod';

export class ModsFactory {
  static create(jarLoader: JarLoader, modId: string): IMod {
    switch (modId) {
      case 'skilltree':
        return new SkillTreeMod(jarLoader);
      case 'minecraft':
        return new MinecraftMod(jarLoader);
      default:
        return new DefaultMod(jarLoader, modId);
    }
  }
}
