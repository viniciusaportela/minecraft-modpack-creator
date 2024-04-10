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

    const parsed = lines.reduce<RefinedParseResult>((acc, line, index) => {
      return this.parseLine(line, acc, {
        index,
        lines,
        last: this.getLastNotUnknown(acc),
      });
    }, []);

    return parsed.filter(
      (field) => !['unknown', 'aggregated-comment'].includes(field.type),
    );
  }

  /**
   * Unknown fields are generally empty lines, they can break the flow of the parser if used.
   * So this function gets only non-unknown fields.
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
        const resultWithLine = { ...result, line: ctx.index + 1 };

        console.log(
          'result: ',
          operation,
          JSON.stringify(resultWithLine, null, 2),
        );
        console.groupEnd();
        return operation === 'add'
          ? [...acc, resultWithLine]
          : [...acc.slice(0, -1), resultWithLine];
      }
    }
  }

  static async isFileValid() {
    return { isValid: true };
  }

  static writeLine() {}
}
