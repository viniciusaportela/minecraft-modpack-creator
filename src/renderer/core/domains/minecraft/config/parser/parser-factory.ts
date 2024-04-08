import { TomlParser } from './toml/TomlParser';
import { JsonParser } from './JsonParser';
import { SNbtParser } from './SNbtParser';

export class ParserFactory {
  static get(extension: string) {
    switch (extension) {
      case 'toml':
        return TomlParser;
      case 'json':
        return JsonParser;
      case 'snbt':
        return SNbtParser;
      default:
        console.warn(`Unknown config file type: ${extension}`);
        return null;
    }
  }
}
