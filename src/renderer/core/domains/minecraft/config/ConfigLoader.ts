import path from 'path';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import recursive from 'recursive-readdir';
import fsExtra from 'fs-extra';
import { ConfigNode } from './ConfigNode';
import { IProject } from '../../../../store/interfaces/project.interface';

export class ConfigLoader {
  constructor(private readonly project: IProject) {}

  async load() {
    const configs: ConfigNode[] = [];
    const toReadStack: ConfigNode[] = [];

    // TODO before calling this, check if has any saves, if not alert user to run a map first
    await this.copyDefaultConfigsFromSaves();
    await this.copyConfigsToSafeArea();

    const initialConfigs = await this.getInitialConfigs();
    toReadStack.push(...initialConfigs);
    configs.push(...initialConfigs);

    while (toReadStack.length > 0) {
      const current = toReadStack.pop()!;
      const currentPath = current.getPath();
      // eslint-disable-next-line no-await-in-loop
      const allFilesInThisPath = await readdir(currentPath, {
        withFileTypes: true,
      });

      // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
      for await (const filePath of allFilesInThisPath) {
        if (filePath.isDirectory()) {
          const directory = new ConfigNode(
            path.join(currentPath, filePath.name),
            {
              isDirectory: true,
            },
          );
          toReadStack.push(directory);
          current.addChild(directory);
        } else {
          const fullPath = path.join(currentPath, filePath.name);
          const node = await new ConfigNode(fullPath).setupFile();
          if (ConfigNode.isCompatible(fullPath)) {
            current.addChild(node);
          }
        }
      }
    }

    return configs;
  }

  static getBaseFolders() {
    return ['config', 'defaultconfigs'];
  }

  async copyConfigsToSafeArea() {
    const basePaths = ConfigLoader.getBaseFolders();

    const safeEditingFolder = path.join(
      this.project.path,
      'minecraft-toolkit',
      'configs',
    );

    for await (const basePath of basePaths) {
      await fsExtra.copy(
        path.join(this.project.path, basePath),
        path.join(safeEditingFolder, basePath),
        { overwrite: false },
      );
    }
  }

  async getInitialConfigs() {
    const entries = [];

    const basePaths = ConfigLoader.getBaseFolders();

    const safeEditingFolder = path.join(
      this.project.path,
      'minecraft-toolkit',
      'configs',
    );

    for await (const basePath of basePaths) {
      entries.push(
        new ConfigNode(path.join(safeEditingFolder, basePath), {
          isDirectory: true,
        }),
      );
    }

    return entries;
  }

  private async copyDefaultConfigsFromSaves() {
    const basePath = path.join(this.project.path, 'defaultconfigs');

    const allSaves = await readdir(path.join(this.project.path, 'saves'));
    for await (const savePath of allSaves) {
      const baseConfigsPath = path.join(
        this.project.path,
        'saves',
        savePath,
        'serverconfig',
      );

      const serverConfigExists = await stat(baseConfigsPath).catch(() => null);
      if (!serverConfigExists) {
        console.warn(baseConfigsPath, "doesn't exist. Skipping...");
        continue;
      }

      const saveConfigs = await recursive(baseConfigsPath);

      const pathWithMetadata = await Promise.all(
        saveConfigs.map(async (fullPath) => {
          const stats = await stat(fullPath);
          return { stats, fullPath };
        }),
      );

      const filesOnly = pathWithMetadata.filter(async (path) =>
        path.stats.isFile(),
      );
      const configFilesRelativeToSaveConfigsFolder = filesOnly.map((fileMeta) =>
        path.relative(baseConfigsPath, fileMeta.fullPath),
      );

      for await (const relativeConfigPath of configFilesRelativeToSaveConfigsFolder) {
        const exists = await stat(
          path.join(basePath, relativeConfigPath),
        ).catch(() => null);

        if (!exists) {
          const sourceData = await readFile(
            path.join(baseConfigsPath, relativeConfigPath),
          );
          const newPath = path.join(basePath, relativeConfigPath);
          const newPathDir = path.dirname(newPath);
          await mkdir(newPathDir, {
            recursive: true,
          });
          await writeFile(newPath, sourceData);
        }
      }
    }
  }
}
