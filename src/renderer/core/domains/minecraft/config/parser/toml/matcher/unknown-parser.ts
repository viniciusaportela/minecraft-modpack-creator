import { LineParser } from './line-parser';
import { ParseContext, ParseResult } from '../../../interfaces/parser';

export class UnknownParser extends LineParser {
  matches(): boolean {
    return true;
  }

  parse(line: string, ctx: ParseContext): ParseResult {
    console.log('parse unknown', line);
    return this.aggregateWithCommentsAndGroups(line, ctx, {
      type: 'unknown',
      name: `Line ${ctx.index}`,
      value: line,
    });
  }
}
