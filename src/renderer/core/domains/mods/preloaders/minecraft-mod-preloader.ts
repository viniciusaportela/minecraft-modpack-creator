import { DefaultModPreloader } from './default-mod-preloader';
import JarLoader from '../../minecraft/jar-loader';
import ModId from '../../../../typings/mod-id.enum';

export class MinecraftModPreloader extends DefaultModPreloader {
  constructor(jar: JarLoader) {
    super(jar, ModId.Minecraft);
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
