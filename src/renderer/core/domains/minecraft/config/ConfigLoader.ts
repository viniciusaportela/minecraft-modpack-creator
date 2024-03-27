import path from 'path';
import { readdir } from 'node:fs/promises';
import { ConfigNode } from './ConfigNode';
import { ProjectModel } from '../../../models/project.model';

export class ConfigLoader {
  constructor(private readonly project: ProjectModel) {}

  async load() {
    const configs: ConfigNode[] = [];
    const toReadStack: ConfigNode[] = [];

    toReadStack.concat(await this.getInitialConfigs());

    while (toReadStack.length > 0) {
      const current = toReadStack.pop()!;
      const allConfigs = await readdir(current.getPath(), {
        withFileTypes: true,
      });

      for await (const configPath of allConfigs) {
        if (configPath.isDirectory()) {
          const directory = new ConfigNode(
            this.project,
            path.join(this.project.path, configPath.name),
            { isDirectory: true },
          );
          configs.push(directory);
          toReadStack.push(directory);
        } else {
          configs.push(
            await new ConfigNode(
              this.project,
              path.join(this.project.path, configPath.name),
            ).initialize(),
          );
        }

        if (current.isDirectory()) {
          current.addChild(configs[configs.length - 1]);
        }
      }
    }

    // DEV remove virtual duplicates?
  }

  async getInitialConfigs() {
    const entries = [];

    entries.push(
      new ConfigNode(this.project, path.join(this.project.path, 'config'), {
        isDirectory: true,
      }),
    );

    entries.push(
      new ConfigNode(
        this.project,
        path.join(this.project.path, 'defaultconfigs'),
        {
          isDirectory: true,
        },
      ),
    );

    const allSaves = await readdir(path.join(this.project.path, 'saves'));
    entries.concat(
      allSaves.map(
        (p) =>
          new ConfigNode(
            this.project,
            path.join(this.project.path, 'saves', p),
            { isDirectory: true, isVirtual: true },
          ),
      ),
    );

    return entries;
  }
}
