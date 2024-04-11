import { TomlParser } from './toml/TomlParser';
import { JsonParser } from './json-parser';
import { SNbtParser } from './snbt-parser';
import { IniParser } from './ini-parser';

export class ParserFactory {
  static ALLOWED_EXTENSIONS = ['toml', 'json', 'snbt', 'ini'];

  static get(extension: string) {
    switch (extension) {
      case 'toml':
        return TomlParser;
      case 'json':
        return JsonParser;
      case 'snbt':
        return SNbtParser;
      case 'ini':
        return IniParser;
      default:
        console.warn(`Unknown config file type: ${extension}`);
        return null;
    }
  }
}
