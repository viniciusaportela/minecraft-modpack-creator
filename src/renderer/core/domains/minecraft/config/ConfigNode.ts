import debounce from 'lodash.debounce';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'path';
import { TomlParser } from './parser/toml/TomlParser';
import { JsonParser } from './parser/json-parser';
import { SNbtParser } from './parser/snbt-parser';
import { ParserFactory } from './parser/parser-factory';
import { IniParser } from './parser/ini-parser';
import { RefinedField } from './interfaces/parser';

export class ConfigNode {
  private children: ConfigNode[] = [];

  private rawData: any = null;

  private parser: TomlParser | JsonParser | SNbtParser | IniParser | null =
    null;

  private fileType: string = '';

  private debounceWrite;

  constructor(
    private readonly path: string,
    private readonly config: {
      isDirectory?: boolean;
    } = {},
  ) {
    this.debounceWrite = debounce(async (newData, callback) => {
      console.log('debounceWrite', !!callback);
      await writeFile(this.path, newData, 'utf-8');
      callback?.();
    }, 500);

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
    const clonedNode = new ConfigNode(this.path, this.config)
      .setParser(this.parser)
      .setRawData(this.rawData);
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
      const clonedNode = new ConfigNode(this.path, this.config)
        .setParser(this.parser)
        .setRawData(this.rawData);

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

  setRawData(rawData: string) {
    this.rawData = rawData;
    return this;
  }

  getFileType() {
    return this.fileType;
  }

  async isValid(): Promise<{
    isValid: boolean;
    severity?: 'error' | 'warning';
  }> {
    if (this.isDirectory()) return { isValid: true };
    if (this.parser === null) return { isValid: false, severity: 'error' };

    const { isValid } = await this.parser.isFileValid(this.path);
    if (!isValid) return { isValid: false, severity: 'error' };

    const toRead = this.getFields() ?? [];
    console.log('toRead', this.path, toRead);

    while (toRead.length) {
      const field = toRead.shift();
      if (field) {
        if (field.type === 'group') toRead.push(...field.children!);

        if (field.type === 'number') {
          const isValid = this.validateNumber(field);
          if (!isValid) return { isValid: false, severity: 'warning' };
        }

        if (field.type === 'string') {
          const isValid = this.validateString(field);
          if (!isValid) return { isValid: false, severity: 'warning' };
        }
      }
    }

    return { isValid: true };
  }

  private validateNumber(field: RefinedField) {
    if (field.value === null) return false;

    if (field.range) {
      if (
        Number(field.value) < field.range[0]! ||
        Number(field.value) > field.range[1]!
      ) {
        console.log('validateNumber', field.value, field.range);
        return false;
      }
    }

    return true;
  }

  private validateString(field: RefinedField) {
    if (field.value === null) return false;

    if (field.allowedValues) {
      if (!field.allowedValues.includes(field.value as string)) {
        console.log('validateString', field.value, field.allowedValues);
        return false;
      }
    }

    return true;
  }

  getFields() {
    try {
      return this.parser?.parseFields(this.rawData);
    } catch (error) {
      console.warn(`Couldn't parse ${this.path}:`, error);
      return null;
    }
  }

  writeRawData(data: any, callback?: (data: string) => void) {
    this.rawData = data;
    this.debounceWrite(data, callback);
  }

  hasRefineEditor(): boolean {
    return this.parser?.canParseFields() ?? false;
  }

  async setupFile() {
    if (!this.config.isDirectory) {
      this.rawData = await readFile(this.path, 'utf-8');
      this.parser = ParserFactory.get(this.fileType);
      return this;
    }

    return this;
  }

  setParser(
    parser: TomlParser | JsonParser | SNbtParser | IniParser | null = null,
  ) {
    this.parser = parser;
    return this;
  }
}
