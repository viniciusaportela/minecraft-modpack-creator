import { BaseModMetadata } from './base-mod-metadata';

export class NullModMetadata extends BaseModMetadata {
  getThumbnail() {
    return null;
  }

  getWebsite() {
    return null;
  }
}
