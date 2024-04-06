import { BaseMetadata } from '../base/base-metadata';
import { CurseforgeModMetadata } from './curseforge-mod-metadata';
import JarLoader from '../../minecraft/jar-loader';
import { NullModMetadata } from '../base/null-mod-metadata';
import { ICurseforgeMetadata } from './interfaces/curse-metadata.interface';

export class CurseforgeMetadata extends BaseMetadata<ICurseforgeMetadata> {
  async getModMetadata(jar: JarLoader) {
    const jarPathSplit = jar.jarPath.split('/');
    const jarFile = jarPathSplit[jarPathSplit.length - 1];

    const addon = this.metadata.installedAddons.find(
      (addon) => addon.fileNameOnDisk === jarFile,
    );

    if (!addon) {
      return new NullModMetadata({});
    }

    return new CurseforgeModMetadata(addon);
  }
}
