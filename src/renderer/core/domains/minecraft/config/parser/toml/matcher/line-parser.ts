import set from 'lodash.set';
import get from 'lodash.get';
import {
  ParseContext,
  ParseResult,
  RefinedField,
} from '../../../interfaces/parser';

export abstract class LineParser {
  abstract matches(line: string): boolean;

  abstract parse(
    line: string,
    ctx?: ParseContext,
  ): { operation: 'add' | 'replace'; result: any };

  protected aggregateWithCommentsAndGroups(
    line: string,
    ctx: ParseContext,
    result: RefinedField,
  ): ParseResult {
    result.indentation = this.countIndentation(line);

    if (!ctx.last) {
      return {
        operation: 'add',
        result,
      };
    }

    const { last, path } = this.getLastMatchingIndentation(
      [ctx.last],
      '',
      result.indentation,
    );

    console.log(
      JSON.stringify(ctx.last, null, 2),
      'last',
      JSON.stringify(last, null, 2),
      'path:',
      path,
      ' ',
      'for indent',
      JSON.stringify(result.indentation, null, 2),
    );

    if (!last) {
      return {
        operation: 'add',
        result,
      };
    }

    if (last.type === 'aggr-comment') {
      return this.replaceLast({
        path,
        root: ctx.last,
        result: {
          ...result,
          comment: `${last.comment}${result.comment ? `\n${result.comment}` : ''}`,
        },
      });
    }

    return this.appendToLast({
      path,
      root: ctx.last,
      result,
    });
  }

  private getLastMatchingIndentation(
    fields: RefinedField[],
    path: string = '',
    indentation = 0,
  ): {
    last: RefinedField | null;
    path: string;
  } {
    const last = fields[fields.length - 1];
    console.group(
      'getLastMatchingIndentation',
      fields,
      path,
      indentation,
      last,
    );

    if (last.type === 'group') {
      /* Will get the last matching the indentation
       Add +1 because properties are always one level deeper
       [group]      -> indentation 0
         property   -> indentation 1
         [group]    -> indentation 1
           property -> indentation 2 */
      if (last.indentation! + 1 === indentation) {
        if (last.children!.length === 0) {
          console.log("doesn't have children, returning itself");
          console.groupEnd();
          return {
            last,
            path,
          };
        }

        console.log(
          `has children, returning last. last.children:`,
          last.children,
        );
        console.groupEnd();
        return {
          last: last.children![last.children!.length - 1],
          path: `${path ? `${path}.` : ''}children.${last.children!.length - 1}`,
        };
      }

      if (last.children?.length) {
        // Still behind the indentation, go deeper
        return this.getLastMatchingIndentation(
          last.children!,
          `${path ? `${path}.` : ''}children.${last.children!.length - 1}`,
          indentation,
        );
      }
    }

    // Couldn't match indentation on the deepest level
    if (last.indentation !== indentation) {
      console.log("Couldn't match indentation", last.indentation, indentation);
      console.groupEnd();
      return { last: null, path: '' };
    }

    console.log('found edge');
    console.groupEnd();
    return {
      last,
      path,
    };
  }

  private replaceLast({
    result,
    root,
    path,
  }: {
    path: string;
    root: RefinedField;
    result: RefinedField;
  }): ParseResult {
    console.log(
      'replaceLast',
      path,
      JSON.stringify(result, null, 2),
      JSON.stringify(root, null, 2),
    );
    if (root.type === 'group') {
      if (!path) {
        return {
          operation: 'replace',
          result,
        };
      }

      console.log(
        'setting',
        path,
        'to',
        JSON.stringify(result, null, 2),
        'from root',
        JSON.stringify(root, null, 2),
      );
      set(root, path, result);

      return {
        operation: 'replace',
        result: root,
      };
    }

    if (path) {
      set(root, path, result);
    }

    return {
      operation: 'replace',
      result: path ? root : result,
    };
  }

  private appendToLast({
    result,
    root,
    path,
  }: {
    path: string;
    root: RefinedField;
    result: RefinedField;
  }): ParseResult {
    console.log(
      'appendToLast, path:',
      path,
      'root:',
      JSON.stringify(root, null, 2),
      'result:',
      JSON.stringify(result, null, 2),
    );

    if (root.type === 'group') {
      if (!path) {
        root.children!.push(result);
        return {
          operation: 'replace',
          result: root,
        };
      }

      const last = get(root, path);

      // Is already getting parent, since there is no child to be the last of the parent
      if (last.type === 'group' && last.children.length === 0) {
        last.children.push(result);
        return {
          operation: 'replace',
          result: root,
        };
      }

      const parentPath = path.split('.').slice(0, -1).join('.');
      const parentGroup = get(root, parentPath);
      parentGroup.push(result);

      return {
        operation: 'replace',
        result: root,
      };
    }

    return {
      operation: 'add',
      result,
    };
  }

  protected countIndentation(line: string): number {
    if (line.startsWith('[')) {
      return 0;
    }

    if (!line.startsWith('\t')) {
      return 0;
    }

    const match = line.match(/^\t+/);
    return match ? match[0].length : 0;
  }
}
