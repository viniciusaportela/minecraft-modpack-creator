import { readFile } from 'node:fs/promises';
import { EmptyWriter } from './base/empty-writer';
import { BaseParser } from './base/base-parser';

export class SNbtParser extends BaseParser {
  async isFileValid(path: string) {
    try {
      const file = await readFile(path, 'utf-8');

      return { isValid: true };
    } catch (err) {
      console.error(err);
      return { isValid: false };
    }
  }

  getFieldWriter(path: string) {
    return new EmptyWriter();
  }
}
