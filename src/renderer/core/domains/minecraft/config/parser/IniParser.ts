export class IniParser {
  static parse(rawData: any) {
    return {};
  }

  static async toOriginal(data: any): Promise<string> {
    return '';
  }

  // TODO add better validation
  static async isFileValid(path: string) {
    return { isValid: true };
  }
}
