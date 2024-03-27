import { mkdir, readFile } from 'node:fs/promises';
import path from 'path';
import { writeFileSync } from 'node:fs';
import { TomlParser } from './TomlParser';
import { JsonParser } from './JsonParser';
import { ProjectModel } from '../../../models/project.model';

export class ConfigNode {
  private children: ConfigNode[] = [];

  private parsed: any = null;

  private realPath: string;

  constructor(
    private readonly project: ProjectModel,
    private readonly path: string,
    private readonly config: {
      isDirectory?: boolean;
      isVirtual?: boolean;
    } = {},
  ) {
    this.realPath = path;
  }

  isDirectory() {
    return this.config.isDirectory ?? false;
  }

  getPath() {
    return this.path;
  }

  getChildren() {
    return this.children;
  }

  addChild(child: ConfigNode) {
    if (!this.isDirectory) throw new Error('Cannot add child to file');
    this.children.push(child);
  }

  async getData() {
    return this.parsed;
  }

  async initialize() {
    if (!this.config.isDirectory) {
      if (this.config.isVirtual) {
        const basePath = path.join(
          this.project.path,
          'minecraft-toolkit',
          'virtual-configs',
          this.project._id.toString(),
        );

        await mkdir(basePath, {
          recursive: true,
        });

        const newPath = path.join(basePath, path.basename(this.path));

        // TODO has to consider case where server config is inside a folder
        const sourceRaw = await readFile(path.join(this.path));

        writeFileSync(newPath, sourceRaw);
      }

      const extension = this.path.split('.').pop();
      switch (extension) {
        case 'toml':
          this.parsed = new TomlParser(this.path).parse();
          break;
        case 'json':
          this.parsed = new JsonParser(this.path).parse();
          break;
        default:
          console.warn(`Unknown config file type: ${extension}`);
      }
    }

    return this;
  }
}
