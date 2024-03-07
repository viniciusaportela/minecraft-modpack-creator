import { DefaultModPreloader } from './default-mod-preloader';
import { SkillTreeModPreloader } from './skill-tree-mod-preloader';
import { IModPreloader } from '../interfaces/mod-preloader.interface';
import JarLoader from '../../domains/minecraft/jar-loader';
import { MinecraftModPreloader } from './minecraft-mod-preloader';

export class ModPreloaderFactory {
  static create(jarLoader: JarLoader, modId: string): IModPreloader {
    switch (modId) {
      case 'skilltree':
        return new SkillTreeModPreloader(jarLoader);
      case 'minecraft':
        return new MinecraftModPreloader(jarLoader);
      default:
        return new DefaultModPreloader(jarLoader, modId);
    }
  }
}
