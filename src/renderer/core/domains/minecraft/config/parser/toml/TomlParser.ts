import {
  ParseContext,
  RefinedField,
  RefinedParseResult,
} from '../../interfaces/parser';
import { CommentParser } from './matcher/comment-parser';
import { SectionParser } from './matcher/section-parser';
import { UnknownParser } from './matcher/unknown-parser';
import { PropertyParser } from './matcher/property-parser';

export class TomlParser {
  private static LINE_PARSERS = [
    SectionParser,
    CommentParser,
    PropertyParser,
    UnknownParser,
  ];

  static parse(rawData: string): RefinedParseResult {
    const lines = rawData.split('\n');

    console.log('lines', lines);

    return lines.reduce<RefinedParseResult>((acc, line, index) => {
      return this.parseLine(line, acc, {
        index,
        lines,
        last: this.getLastNotUnknown(acc),
      });
    }, []);
  }

  /**
   * Unknown fields are generally empty lines, they can break the flow of the parser if used.
   * So this function get only non-unknown fields.
   * @param acc
   * @private
   */
  private static getLastNotUnknown(
    acc: RefinedParseResult,
  ): RefinedField | undefined {
    if (acc.length === 0) {
      return undefined;
    }

    return acc[acc.length - 1].type !== 'unknown'
      ? acc[acc.length - 1]
      : this.getLastNotUnknown(acc.slice(0, -1));
  }

  // eslint-disable-next-line consistent-return
  private static parseLine(
    line: string,
    acc: RefinedParseResult,
    ctx: ParseContext,
    // @ts-ignore
  ): RefinedParseResult {
    for (const Parser of this.LINE_PARSERS) {
      const parser = new Parser();
      if (parser.matches(line)) {
        console.group('line');
        const { operation, result } = parser.parse(line, ctx);
        console.log('result: ', operation, JSON.stringify(result, null, 2));
        console.groupEnd();
        return operation === 'add'
          ? [...acc, result]
          : [...acc.slice(0, -1), result];
      }
    }
  }

  // DEV
  static async toOriginal() {}

  static async isFileValid() {
    return { isValid: true };
  }
}
