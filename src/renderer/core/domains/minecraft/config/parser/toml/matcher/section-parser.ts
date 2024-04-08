import { LineParser } from './line-parser';
import { ParseContext, ParseResult } from '../../../interfaces/parser';

export class SectionParser extends LineParser {
  private PATTERN = /^\["?(.*?)"?]/;

  matches(line: string): boolean {
    return this.PATTERN.test(line.trim());
  }

  parse(line: string, ctx: ParseContext): ParseResult {
    console.log('parse section', line);
    return this.aggregateWithCommentsAndGroups(line, ctx, {
      type: 'group',
      name: this.PATTERN.exec(line.trim())![1],
      value: '',
      children: [],
    });
  }
}
