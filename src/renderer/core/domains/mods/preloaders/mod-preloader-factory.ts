import { DefaultModPreloader } from './default-mod-preloader';
import { SkillTreeModPreloader } from '../skilltree/skill-tree-mod-preloader';
import JarLoader from '../../minecraft/jar-loader';
import { MinecraftModPreloader } from './minecraft-mod-preloader';
import { KubejsPreloader } from '../kubejs/kubejs-preloader';

export class ModPreloaderFactory {
  static async create(jarLoader: JarLoader): Promise<DefaultModPreloader> {
    const modId = await jarLoader.getModId();

    switch (modId) {
      case 'skilltree':
        return new SkillTreeModPreloader(jarLoader);
      case 'minecraft':
        return new MinecraftModPreloader(jarLoader);
      case 'kubejs':
        return new KubejsPreloader(jarLoader);
      default:
        return new DefaultModPreloader(jarLoader, modId);
    }
  }
}
