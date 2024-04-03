import debounce from 'lodash.debounce';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'path';
import { TomlParser } from './TomlParser';
import { JsonParser } from './JsonParser';

export class ConfigNode {
  private children: ConfigNode[] = [];

  private rawData: any = null;

  private parser: TomlParser | JsonParser | null = null;

  private fileType: string = '';

  private debounceWrite;

  constructor(
    private readonly path: string,
    private readonly config: {
      isDirectory?: boolean;
    } = {},
  ) {
    this.debounceWrite = debounce(async (newData) => {
      await writeFile(this.path, newData, 'utf-8');
    }, 1000);

    if (!config.isDirectory) {
      this.fileType = path.split('.').pop()!;
    }
  }

  static isCompatible(path: string) {
    const extension = path.split('.').pop()!;
    return ['toml', 'json'].includes(extension);
  }

  isDirectory() {
    return this.config.isDirectory ?? false;
  }

  getPath() {
    return this.path;
  }

  cloneWithFilter(filter: string) {
    if (this.isDirectory()) {
      const clonedNode = new ConfigNode(this.path, this.config);

      this.children.forEach((child) => {
        if (child.isDirectory()) {
          const childChildren = child.cloneWithFilter(filter);
          if (childChildren) {
            clonedNode.addChild(childChildren);
          }
        } else if (path.basename(child.getPath()).includes(filter)) {
          clonedNode.addChild(child);
        }
      });

      return clonedNode;
    }

    return path.basename(this.path).includes(filter)
      ? new ConfigNode(this.path, this.config)
      : null;
  }

  getChildren() {
    return this.children;
  }

  addChild(child: ConfigNode) {
    if (!this.isDirectory) throw new Error('Cannot add child to file');
    this.children.push(child);
  }

  getRawData() {
    return this.rawData;
  }

  getFileType() {
    return this.fileType;
  }

  getData() {
    return this.parser?.parse(this.rawData);
  }

  writeRawData(data: any) {
    this.rawData = data;
    this.debounceWrite(data);
  }

  async setupFile() {
    if (!this.config.isDirectory) {
      this.rawData = await readFile(this.path, 'utf-8');

      switch (this.fileType) {
        case 'toml':
          this.parser = new TomlParser();
          break;
        case 'json':
          this.parser = new JsonParser();
          break;
        default:
          console.warn(`Unknown config file type: ${this.fileType}`);
      }
    }

    return this;
  }
}
