import { LineParser } from './line-parser';
import { ParseContext, ParseResult } from '../../../interfaces/parser';

export class PropertyParser extends LineParser {
  private PATTERN = /"?([^"]*?)"?\s*=\s*(.*)/;

  matches(line: string): boolean {
    return this.PATTERN.test(line);
  }

  parse(line: string, ctx: ParseContext): ParseResult {
    const [, name, value] = this.PATTERN.exec(line)!;
    console.log('parse property', line, name, value);
    return this.aggregateWithCommentsAndGroups(line, ctx, {
      name: name.trim(),
      value: value.trim(),
      type: this.getType(value),
    });
  }

  private getType(value: string): 'string' | 'number' | 'boolean' {
    if (value === 'true' || value === 'false') {
      return 'boolean';
    }

    if (!Number.isNaN(Number(value))) {
      return 'number';
    }

    return 'string';
  }
}
