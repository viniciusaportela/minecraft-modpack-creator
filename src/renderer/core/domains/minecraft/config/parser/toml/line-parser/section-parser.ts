import { LineParser } from './line-parser';
import { ParseContext, ParseResult } from '../../../interfaces/parser';
import { countIndentation } from '../helpers/count-indentation';

export class SectionParser extends LineParser {
  private PATTERN = /^\["?(.*?)"?]/;

  matches(line: string): boolean {
    return this.PATTERN.test(line.trim());
  }

  parse(line: string, ctx: ParseContext): ParseResult {
    return this.aggregateWithComment(ctx, {
      type: 'group',
      name: this.PATTERN.exec(line.trim())![1],
      value: '',
      children: [],
      lineNumber: ctx.lineNumber,
      indentation: countIndentation(line),
    });
  }
}
