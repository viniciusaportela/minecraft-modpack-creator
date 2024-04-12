import {
  ParseContext,
  ParseResult,
  RefinedField,
} from '../../../interfaces/parser';

export abstract class LineParser {
  abstract matches(line: string): boolean;

  abstract parse(line: string, ctx?: ParseContext): ParseResult;

  protected aggregateWithComment(
    ctx: ParseContext,
    result: RefinedField,
  ): ParseResult {
    if (!ctx.last) {
      return {
        operation: 'add',
        result,
      };
    }

    if (ctx.last.type === 'aggr-comment') {
      return {
        operation: 'replace',
        result: {
          ...result,
          comment: `${ctx.last.comment}${result.comment ? `\n${result.comment}` : ''}`,
          allowedValues: result.allowedValues ?? ctx.last.allowedValues,
          range: result.range ?? ctx.last.range,
        },
      };
    }

    return {
      operation: 'add',
      result,
    };
  }
}
