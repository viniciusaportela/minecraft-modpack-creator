import JarLoader from '../../minecraft/jar-loader';

export class DefaultModPreloader {
  private jar: JarLoader;

  private modId: string;

  constructor(jar: JarLoader, modId: string) {
    this.jar = jar;
    this.modId = modId;
  }

  async generateConfig(): Promise<Record<string, unknown>> {
    return {
      initialized: false,
    };
  }
}
