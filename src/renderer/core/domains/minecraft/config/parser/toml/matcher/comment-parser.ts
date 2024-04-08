import { LineParser } from './line-parser';
import { ParseContext, ParseResult } from '../../../interfaces/parser';

export class CommentParser extends LineParser {
  private PATTERN = /#(.*)/;

  private CHARS_TO_IGNORE = ['.', ',', ';'];

  matches(line: string): boolean {
    return this.PATTERN.test(line);
  }

  parse(line: string, ctx: ParseContext): ParseResult {
    console.log('parse comment', line);
    let commentValue = this.PATTERN.exec(line)![1].trim();

    const uniqueChars = new Set(commentValue.split(''));
    this.CHARS_TO_IGNORE.forEach((char) => uniqueChars.delete(char));
    if (uniqueChars.size === 0) {
      commentValue = '';
    }

    return super.aggregateWithCommentsAndGroups(line, ctx, {
      type: 'aggr-comment',
      comment: commentValue,
      name: '',
      value: '',
    });
  }
}
