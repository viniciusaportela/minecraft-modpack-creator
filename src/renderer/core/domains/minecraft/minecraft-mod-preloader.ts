import { DefaultModPreloader } from '../preloaders/default-mod-preloader';
import JarLoader from './jar-loader';

export class MinecraftModPreloader extends DefaultModPreloader {
  constructor(jar: JarLoader) {
    super(jar, 'minecraft');
  }

  async generateConfig() {
    return {};
  }

  async getUserConfigs() {
    return {
      server: null,
      client: null,
      common: null,
    };
  }
}
