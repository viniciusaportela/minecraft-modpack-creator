import { DefaultModPreloader } from '../../preloaders/default-mod-preloader';
import JarLoader from '../../minecraft/jar-loader';

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
