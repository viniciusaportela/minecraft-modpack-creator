import { DefaultMod } from './default-mod';
import JarLoader from '../domains/minecraft/jar-loader';

export class MinecraftMod extends DefaultMod {
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
