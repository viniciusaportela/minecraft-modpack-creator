import { BaseDirectory } from './base-directory';

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
}
