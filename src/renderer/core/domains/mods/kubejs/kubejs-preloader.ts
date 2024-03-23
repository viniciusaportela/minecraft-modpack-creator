import { DefaultModPreloader } from '../preloaders/default-mod-preloader';
import JarLoader from '../../minecraft/jar-loader';
import ModId from '../../../../typings/mod-id.enum';

export class KubejsPreloader extends DefaultModPreloader {
  constructor(jar: JarLoader) {
    super(jar, ModId.KubeJS);
  }

  async generateConfig(): Promise<Record<string, unknown>> {
    const base = await super.generateConfig();

    return {
      ...base,
      recipes: [],
      items: [],
      blocks: [],
      scripts: {
        client: [],
        server: [],
        startup: [],
      },
    };
  }
}
