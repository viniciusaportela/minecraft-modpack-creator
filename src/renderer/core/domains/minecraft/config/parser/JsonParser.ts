import { readFile } from 'node:fs/promises';

export class JsonParser {
  constructor() {}

  static parse(rawData: any) {
    try {
      return JSON.parse(rawData);
    } catch (err) {
      console.error('[JsonParser.parse]', err);
      return {};
    }
  }

  static async toOriginal(data: any): Promise<string> {
    return JSON.stringify(data, null, 2);
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
}
