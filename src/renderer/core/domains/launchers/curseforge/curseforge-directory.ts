import path from 'path';
import { LauncherDirectory } from '../base/launcher-directory';

export class CurseforgeDirectory extends LauncherDirectory {
  async getMinecraftJarPath() {
    const initialPart = this.modpackFolder.split('Instances')[0];
    const metadata = await this.getMetadata();

    if (!metadata) {
      return null;
    }

    const { minecraftVersion } = metadata;

    return path.join(
      initialPart,
      'Install',
      'versions',
      minecraftVersion,
      `${minecraftVersion}.jar`,
    );
  }
}
