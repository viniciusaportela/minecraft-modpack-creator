import debounce from 'lodash.debounce';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'path';
import { TomlParser } from './parser/toml/TomlParser';
import { JsonParser } from './parser/json-parser';
import { SNbtParser } from './parser/snbt-parser';
import { ParserFactory } from './parser/parser-factory';

export class ConfigNode {
  private children: ConfigNode[] = [];

  private rawData: any = null;

  private parser:
    | typeof TomlParser
    | typeof JsonParser
    | typeof SNbtParser
    | null = null;

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
    return ParserFactory.ALLOWED_EXTENSIONS.includes(extension);
  }

  isFile() {
    return !this.config.isDirectory;
  }

  isDirectory() {
    return this.config.isDirectory ?? false;
  }

  getPath() {
    return this.path;
  }

  cloneFlat() {
    const clonedNode = new ConfigNode(this.path, this.config).setParser(
      this.parser,
    );
    const flatted: ConfigNode[] = clonedNode.isDirectory() ? [] : [clonedNode];

    if (this.isDirectory()) {
      this.children.forEach((child) => {
        flatted.push(...child.cloneFlat());
      });
    }

    return flatted.flat();
  }

  cloneWithFilter(filter: string) {
    if (this.isDirectory()) {
      const clonedNode = new ConfigNode(this.path, this.config).setParser(
        this.parser,
      );

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

  async isValid() {
    if (this.isDirectory()) return true;
    if (this.parser === null) return false;

    const { isValid } = await this.parser.isFileValid(this.path);
    return isValid;
  }

  getData() {
    try {
      return this.parser?.parse(this.rawData);
    } catch (error) {
      console.warn(`Couldn't parse ${this.path}:`, error);
      return null;
    }
  }

  writeRawData(data: any) {
    this.rawData = data;
    this.debounceWrite(data);
  }

  async setupFile() {
    if (!this.config.isDirectory) {
      this.rawData = await readFile(this.path, 'utf-8');
      this.parser = ParserFactory.get(this.fileType);
    }

    return this;
  }

  setParser(
    parser:
      | typeof TomlParser
      | typeof JsonParser
      | typeof SNbtParser
      | null = null,
  ) {
    this.parser = parser;
    return this;
  }
}
