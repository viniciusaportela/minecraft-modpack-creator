import { LauncherDirectory } from '../base/launcher-directory';
import { MinecraftDirectory } from '../minecraft/minecraft-directory';

export class SKLauncherDirectory extends LauncherDirectory {
  async getMinecraftJarPath(): Promise<string | null> {
    const meta = await this.getMetadata();

    console.log(meta);
    if (!meta) {
      return null;
    }

    const { minecraftVersion } = meta;
    const minecraftPath = this.modpackFolder.split('/').slice(0, -2).join('/');
    const minecraftDir = new MinecraftDirectory(minecraftPath);

    return minecraftDir.getMinecraftJarPathByVersion(minecraftVersion);
  }
}
