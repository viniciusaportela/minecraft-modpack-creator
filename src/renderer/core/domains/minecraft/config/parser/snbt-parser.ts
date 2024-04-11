import { EmptyWriter } from './empty-writer';

export class SNbtParser {
  static parse(rawData: string) {
    return {};
  }

  // DEV
  static async isFileValid(path: string) {
    return { isValid: true };
  }

  static getWriter(path: string) {
    return new EmptyWriter();
  }
}
