import { readFile } from 'node:fs/promises';
import { EmptyWriter } from './empty-writer';

export class JsonParser {
  static parse(rawData: any) {
    try {
      return JSON.parse(rawData);
    } catch (err) {
      console.error('[JsonParser.parse]', err);
      return {};
    }
  }

  static async isFileValid(path: string) {
    try {
      const file = await readFile(path, 'utf-8');
      JSON.parse(file);
      return { isValid: true };
    } catch (err) {
      return { isValid: false, error: err };
    }
  }

  static getWriter(path: string) {
    return new EmptyWriter();
  }
}
