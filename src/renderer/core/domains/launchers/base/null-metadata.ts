import { BaseMetadata } from './base-metadata';
import { BaseModMetadata } from './base-mod-metadata';
import { NullModMetadata } from './null-mod-metadata';

export class NullMetadata extends BaseMetadata {
  async getModMetadata(): Promise<BaseModMetadata> {
    return new NullModMetadata({});
  }
}
