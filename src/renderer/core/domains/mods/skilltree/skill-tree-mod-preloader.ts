import { DefaultModPreloader } from '../preloaders/default-mod-preloader';
import JarLoader from '../../minecraft/jar-loader';
import ModId from '../../../../typings/mod-id.enum';

export class SkillTreeModPreloader extends DefaultModPreloader {
  constructor(jar: JarLoader) {
    super(jar, ModId.PassiveSkillTree);
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
