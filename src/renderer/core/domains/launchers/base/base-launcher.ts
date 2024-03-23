import os from 'os';
import path from 'path';
import { readdir } from 'node:fs/promises';
import { BaseDirectory } from './base-directory';
import { ProjectModel } from '../../../models/project.model';

export interface IProjectData {
  name: string;
  path: string;
  minecraftVersion: string;
  loaderVersion: string;
  loader: string;
  launcher: string;
  cachedAmountInstalledMods?: number;
}

export abstract class BaseLauncher {
  abstract getDirectory(folder: string): BaseDirectory;

  abstract isFolderOfThisLauncher(folder: string): Promise<boolean>;

  abstract getProjectData(folder: string): Promise<IProjectData>;

  abstract findModpackFolders(): Promise<string[]>;

  protected getMinecraftPath() {
    if (process.platform === 'linux') {
      const home = os.homedir();
      return path.join(home, '.minecraft');
    }

    return null;
  }
}
