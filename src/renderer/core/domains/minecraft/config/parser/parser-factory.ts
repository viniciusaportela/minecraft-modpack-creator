import { TomlParser } from './toml/TomlParser';
import { JsonParser } from './json-parser';
import { SNbtParser } from './snbt-parser';
import { IniParser } from './ini-parser';

export class ParserFactory {
  static ALLOWED_EXTENSIONS = ['toml', 'json', 'snbt', 'ini'];

  static get(extension: string) {
    switch (extension) {
      case 'toml':
        return new TomlParser();
      case 'json':
        return new JsonParser();
      case 'snbt':
        return new SNbtParser();
      case 'ini':
        return new IniParser();
      default:
        console.warn(`Unknown config file type: ${extension}`);
        return null;
    }
  }
}
