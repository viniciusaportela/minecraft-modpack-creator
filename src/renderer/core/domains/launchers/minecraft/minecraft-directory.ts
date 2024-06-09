import path from 'path';
import { LauncherDirectory } from '../base/launcher-directory';
import { useAppStore } from '../../../../store/app.store';

export class MinecraftDirectory extends LauncherDirectory {
  async getMinecraftJarPath(): Promise<string> {
    const project = useAppStore.getState().selectedProject();

    if (!project) {
      console.warn("Can't determine minecraft version without project");
      return '';
    }

    const version = project.minecraftVersion;

    return this.getMinecraftJarPathByVersion(version);
  }

  getMinecraftJarPathByVersion(version: string) {
    return path.join(this.modpackFolder, 'versions', version, `${version}.jar`);
  }
}
