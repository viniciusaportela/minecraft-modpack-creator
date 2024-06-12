import os from 'os';
import path from 'path';
import { ipcRenderer } from 'electron';
import { LauncherDirectory } from './launcher-directory';
import { IProject } from '../../../../store/interfaces/project.interface';

export abstract class BaseLauncher {
  abstract toDirectory(folder: string): LauncherDirectory;

  abstract isFolderOfThisLauncher(folder: string): Promise<boolean>;

  abstract genProjectFromFolder(
    folder: string,
  ): Promise<Omit<IProject, 'index'> | null>;

  abstract getModpacksFolders(): Promise<string[]>;

  protected async getMinecraftRoot() {
    if (process.platform === 'linux') {
      const home = os.homedir();
      return path.join(home, '.minecraft');
    }

    if (process.platform === 'win32') {
      const appData = await ipcRenderer.invoke('getPath', 'appData');
      return path.join(appData, '.minecraft');
    }

    return null;
  }
}
