import { BaseModMetadata } from '../base/base-mod-metadata';
import { IMod } from '../../minecraft/interfaces/curse-metadata.interface';

export class CurseforgeModMetadata extends BaseModMetadata<IMod> {
  getThumbnail() {
    return this.modMetadata.thumbnailUrl;
  }

  getWebsite() {
    return this.modMetadata.webSiteURL;
  }
}
