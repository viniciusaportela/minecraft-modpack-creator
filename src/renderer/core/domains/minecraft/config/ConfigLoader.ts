import path from 'path';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import recursive from 'recursive-readdir';
import { ConfigNode } from './ConfigNode';
import { ProjectModel } from '../../../models/project.model';

export class ConfigLoader {
  constructor(private readonly project: ProjectModel) {}

  async load() {
    const configs: ConfigNode[] = [];
    const toReadStack: ConfigNode[] = [];

    // DEV before calling this, check if has any saves, if not alert user to run a map first
    await this.copyDefaultConfigs();

    const initialConfigs = this.getInitialConfigs();
    toReadStack.push(...initialConfigs);
    configs.push(...initialConfigs);

    while (toReadStack.length > 0) {
      const current = toReadStack.pop()!;
      const currentPath = current.getPath();
      const allFilesInThisPath = await readdir(currentPath, {
        withFileTypes: true,
      });

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
          const node = new ConfigNode(fullPath);
          if (ConfigNode.isCompatible(fullPath)) {
            current.addChild(node);
          }
        }
      }
    }

    return configs;
  }

  getInitialConfigs() {
    const entries = [];

    entries.push(
      new ConfigNode(path.join(this.project.path, 'config'), {
        isDirectory: true,
      }),
    );

    entries.push(
      new ConfigNode(path.join(this.project.path, 'defaultconfigs'), {
        isDirectory: true,
      }),
    );

    return entries;
  }

  private async copyDefaultConfigs() {
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
      const configFilesRelativeToSaveConfigsFolder = filesOnly.map((pathMeta) =>
        pathMeta.fullPath.replace(`${baseConfigsPath}/`, ''),
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
