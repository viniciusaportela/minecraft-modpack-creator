import { LineParser } from './line-parser';
import { ParseContext, ParseResult } from '../../../interfaces/parser';
import { countIndentation } from '../helpers/count-indentation';

export class PropertyParser extends LineParser {
  private PATTERN = /"?([^"]*?)"?\s*=\s*(.*)/;

  matches(line: string): boolean {
    return this.PATTERN.test(line);
  }

  parse(line: string, ctx: ParseContext): ParseResult {
    const [, name, value] = this.PATTERN.exec(line)!;
    console.log('parse property', line, name, value);
    return this.aggregateWithComment(ctx, {
      name: name.trim(),
      value: this.parseValue(value.trim()),
      array: this.isArray(value.trim()),
      type: this.getType(value),
      indentation: countIndentation(line),
      lineNumber: ctx.lineNumber,
    });
  }

  private isArray(value: string) {
    return value.startsWith('[') && value.endsWith(']');
  }

  private parseValue(value: string): string {
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }

    return value;
  }

  private getType(value: string): 'string' | 'number' | 'boolean' {
    const isArray = this.isArray(value);

    if (isArray) {
      const parsed = JSON.parse(value);
      const [first] = parsed;

      if (typeof first === 'boolean') {
        return 'boolean';
      }

      if (typeof first === 'number') {
        return 'number';
      }

      return 'string';
    }

    if (['true', 'false'].includes(value)) {
      return 'boolean';
    }

    if (!Number.isNaN(Number(value))) {
      return 'number';
    }

    return 'string';
  }
}
