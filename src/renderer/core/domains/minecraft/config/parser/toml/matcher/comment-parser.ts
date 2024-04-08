import { LineParser } from './line-parser';
import { ParseContext, ParseResult } from '../../../interfaces/parser';

export class CommentParser extends LineParser {
  private PATTERN = /#(.*)/;

  matches(line: string): boolean {
    return this.PATTERN.test(line);
  }

  parse(line: string, ctx: ParseContext): ParseResult {
    console.log('parse comment', line);
    return super.aggregateWithCommentsAndGroups(line, ctx, {
      type: 'aggr-comment',
      comment: this.PATTERN.exec(line)![1].trim(),
      name: '',
      value: '',
    });
  }
}
