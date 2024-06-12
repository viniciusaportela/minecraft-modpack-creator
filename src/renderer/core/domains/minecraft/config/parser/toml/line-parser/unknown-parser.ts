import { LineParser } from './line-parser';
import { ParseContext, ParseResult } from '../../../interfaces/parser';
import { countIndentation } from '../helpers/count-indentation';

export class UnknownParser extends LineParser {
  matches(): boolean {
    return true;
  }

  parse(line: string, ctx: ParseContext): ParseResult {
    return this.aggregateWithComment(ctx, {
      type: 'unknown',
      name: `Line ${ctx.lineNumber}`,
      value: line,
      lineNumber: ctx.lineNumber,
      indentation: countIndentation(line),
    });
  }
}
