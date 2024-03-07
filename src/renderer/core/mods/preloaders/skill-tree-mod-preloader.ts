import { DefaultModPreloader } from './default-mod-preloader';
import JarLoader from '../../domains/minecraft/jar-loader';

export class SkillTreeModPreloader extends DefaultModPreloader {
  constructor(jar: JarLoader) {
    super(jar, 'skilltree');
  }

  async generateConfig() {
    return {
      ...(await super.generateConfig()),
      tree: {
        nodes: [],
        edges: [],
      },
    };
  }
}
