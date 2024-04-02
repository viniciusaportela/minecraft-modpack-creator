import cloneDeep from 'lodash.clonedeep';
import debounce from 'lodash.debounce';
import { writeFile } from 'node:fs/promises';
import { TomlParser } from './TomlParser';
import { JsonParser } from './JsonParser';

export const Root = Symbol('Root');

export class ConfigNode {
  private children: ConfigNode[] = [];

  private parsed: any = null;

  private fileType: string = '';

  private debounceWrite;

  constructor(
    private readonly path: string,
    private readonly config: {
      isDirectory?: boolean;
    } = {},
  ) {
    this.debounceWrite = debounce(async (data) => {
      await writeFile(this.path, this.toOriginal(data), 'utf-8');
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

  getChildren() {
    return this.children;
  }

  addChild(child: ConfigNode) {
    if (!this.isDirectory) throw new Error('Cannot add child to file');
    this.children.push(child);
  }

  async getData() {
    return cloneDeep(this.parsed);
  }

  async writeData(data: any) {
    this.parsed = cloneDeep(data);
    this.debounceWrite(data);
  }

  async loadFile() {
    if (!this.config.isDirectory) {
      switch (this.fileType) {
        case 'toml':
          this.parsed = new TomlParser(this.path).parse();
          break;
        case 'json':
          this.parsed = new JsonParser(this.path).parse();
          break;
        default:
          console.warn(`Unknown config file type: ${this.fileType}`);
      }
    }

    return this;
  }

  private toOriginal(data: any) {
    switch (this.fileType) {
      case 'toml':
        return new TomlParser(this.path).toOriginal(data);
      case 'json':
        return new JsonParser(this.path).toOriginal(data);
      default:
        return '';
    }
  }
}
