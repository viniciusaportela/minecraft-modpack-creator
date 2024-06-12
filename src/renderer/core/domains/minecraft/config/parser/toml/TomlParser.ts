import { parse } from 'toml';
import { readFile } from 'node:fs/promises';
import { ParseContext, RefinedField, Writer } from '../../interfaces/parser';
import { CommentParser } from './line-parser/comment-parser';
import { SectionParser } from './line-parser/section-parser';
import { UnknownParser } from './line-parser/unknown-parser';
import { PropertyParser } from './line-parser/property-parser';
import { TomlWriter } from './TomlWriter';
import { countIndentation } from './helpers/count-indentation';
import { BaseParser } from '../base/base-parser';

export class TomlParser extends BaseParser {
  private LINE_PARSERS = [
    SectionParser,
    CommentParser,
    PropertyParser,
    UnknownParser,
  ];

  parseFields(rawData: string): RefinedField[] {
    const lines = rawData.split('\n');

    const parsed = lines.reduce<RefinedField[]>((acc, line, index) => {
      const { last, lastGroup } = this.getLast(line, acc);

      return this.parseLine(line, acc, {
        lineNumber: index + 1,
        lines,
        last,
        lastGroup,
      });
    }, []);

    return parsed.filter(
      (field) => !['unknown', 'aggregated-comment'].includes(field.type),
    );
  }

  private getLast(
    currentLine: string,
    acc: RefinedField[],
  ): { last: RefinedField | undefined; lastGroup: RefinedField | undefined } {
    const lastRoot = this.getLastRoot(currentLine, acc);

    if (!lastRoot) {
      return { last: undefined, lastGroup: undefined };
    }

    if (lastRoot.type === 'group') {
      return (
        this.getLastMatchingIndentationFromGroup(
          lastRoot,
          '',
          countIndentation(currentLine),
        ) ?? lastRoot
      );
    }

    return { last: lastRoot, lastGroup: undefined };
  }

  private getLastRoot(
    currentLine: string,
    acc: RefinedField[],
  ): RefinedField | undefined {
    if (acc.length === 0) {
      return undefined;
    }

    return acc[acc.length - 1].type !== 'unknown'
      ? acc[acc.length - 1]
      : this.getLastRoot(currentLine, acc.slice(0, -1));
  }

  private getLastMatchingIndentationFromGroup(
    group: RefinedField | undefined,
    path: string,
    currentIndentation: number,
  ): { last: RefinedField | undefined; lastGroup: RefinedField | undefined } {
    if (!group) {
      return { last: undefined, lastGroup: undefined };
    }

    if (currentIndentation === group.indentation + 1) {
      return {
        last: group.children!.length
          ? group.children![group.children!.length - 1]
          : undefined,
        lastGroup: group,
      };
    }

    if (group.children) {
      return this.getLastMatchingIndentationFromGroup(
        group.children[group.children.length - 1],
        `${path ? `${path}.` : ''}children`,
        currentIndentation,
      );
    }

    return { last: undefined, lastGroup: undefined };
  }

  // eslint-disable-next-line consistent-return
  private parseLine(
    line: string,
    acc: RefinedField[],
    ctx: ParseContext,
    // @ts-ignore
  ): RefinedField[] {
    for (const Parser of this.LINE_PARSERS) {
      const lineParser = new Parser();
      if (lineParser.matches(line)) {
        const { operation, result } = lineParser.parse(line, ctx);

        if (ctx.lastGroup) {
          if (operation === 'add') {
            ctx.lastGroup.children!.push(result);
          } else if (operation === 'replace') {
            ctx.lastGroup.children![ctx.lastGroup.children!.length - 1] =
              result;
          }

          return acc;
        }

        return operation === 'add'
          ? [...acc, result]
          : [...acc.slice(0, -1), result];
      }
    }
  }

  async isFileValid(path: string) {
    try {
      const file = await readFile(path, 'utf-8');
      await parse(file);
      return { isValid: true, error: null };
    } catch (err) {
      console.error(err);
      return { isValid: false, error: err };
    }
  }

  getFieldWriter(path: string): Writer {
    return new TomlWriter(path);
  }

  canParseFields(): boolean {
    return true;
  }
}
