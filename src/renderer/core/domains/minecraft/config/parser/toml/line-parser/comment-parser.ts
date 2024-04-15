import { LineParser } from './line-parser';
import { ParseContext, ParseResult } from '../../../interfaces/parser';
import { countIndentation } from '../helpers/count-indentation';

export class CommentParser extends LineParser {
  private PATTERN = /^#(.*)/;

  private CHARS_TO_IGNORE = ['.', ',', ';'];

  matches(line: string): boolean {
    return this.PATTERN.test(line.trim().replaceAll(/\t/g, ''));
  }

  parse(line: string, ctx: ParseContext): ParseResult {
    console.log('parse comment', line);
    let commentValue = this.PATTERN.exec(line)![1].trim();

    const uniqueChars = new Set(commentValue.split(''));
    this.CHARS_TO_IGNORE.forEach((char) => uniqueChars.delete(char));
    if (uniqueChars.size === 0) {
      commentValue = '';
    }

    const allowedValues = this.processAllowedValues(line);
    const range = this.processRange(line);

    if (allowedValues || range) {
      commentValue = '';
    }

    return super.aggregateWithComment(ctx, {
      type: 'aggr-comment',
      comment: commentValue,
      indentation: countIndentation(line),
      name: '',
      value: '',
      lineNumber: ctx.lineNumber + 1,
      allowedValues,
      range,
    });
  }

  private processAllowedValues(line: string) {
    const isAllowedValues = line.includes('Allowed Values:');

    if (isAllowedValues) {
      const allowedValues = line.split('Allowed Values:')[1];
      return allowedValues.split(',').map((v) => v.trim());
    }

    return undefined;
  }

  private processRange(
    line: string,
  ): [number | undefined, number | undefined] | undefined {
    const isRange = line.includes('Range:');

    if (isRange) {
      const range = line.split('Range:')[1];

      if (range.includes('>')) {
        return [undefined, Number(range.split('>')[1])];
      }

      if (range.includes('<')) {
        return [Number(range.split('<')[1]), undefined];
      }

      const [min, max] = range.split('~');
      return [Number(min), Number(max)];
    }

    return undefined;
  }
}
