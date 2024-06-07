import { readFile } from 'node:fs/promises';
import { EmptyWriter } from './base/empty-writer';
import { BaseParser } from './base/base-parser';

export class SNbtParser extends BaseParser {
  async isFileValid(path: string) {
    try {
      await readFile(path, 'utf-8');
      return { isValid: true, error: null };
    } catch (err) {
      console.error(err);
      return { isValid: false, error: err };
    }
  }

  getFieldWriter(path: string) {
    return new EmptyWriter();
  }
}
