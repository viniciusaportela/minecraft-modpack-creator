import { readFile } from 'node:fs/promises';
import { EmptyWriter } from './base/empty-writer';
import { BaseParser } from './base/base-parser';

export class JsonParser extends BaseParser {
  async isFileValid(path: string) {
    try {
      const file = await readFile(path, 'utf-8');
      JSON.parse(file);
      return { isValid: true };
    } catch (err) {
      return { isValid: false, error: err };
    }
  }

  getFieldWriter(path: string) {
    return new EmptyWriter();
  }
}
