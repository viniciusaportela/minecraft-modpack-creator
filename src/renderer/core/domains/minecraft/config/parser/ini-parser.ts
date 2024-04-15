import { TomlParser } from './toml/TomlParser';

export class IniParser extends TomlParser {
  async isFileValid(path: string) {
    return { isValid: true };
  }
}
