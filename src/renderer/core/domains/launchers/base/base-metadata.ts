import { BaseModMetadata } from './base-mod-metadata';
import JarLoader from '../../minecraft/jar-loader';

export abstract class BaseMetadata<TMetadata = any> {
  constructor(protected readonly metadata: TMetadata) {}

  abstract getModMetadata(jar: JarLoader): Promise<BaseModMetadata>;

  getRaw() {
    return this.metadata;
  }
}
