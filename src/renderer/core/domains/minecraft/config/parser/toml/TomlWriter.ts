import { readFile, writeFile } from 'node:fs/promises';
import { RefinedField, Writer } from '../../interfaces/parser';

export class TomlWriter implements Writer {
  constructor(private readonly path: string) {}

  async write(field: RefinedField, newValue: any): Promise<void> {
    const { lineNumber } = field;

    const file = await readFile(this.path, 'utf-8');
    const lines = file.split('\n');
    lines[lineNumber] = this.genLine(field, newValue);

    await writeFile(this.path, lines.join('\n'));
  }

  genLine(field: RefinedField, newValue: any): string {
    const { type, name, indentation } = field;
    const indent = '\t'.repeat(indentation ?? 0);

    if (type === 'string') {
      return `${indent}${name} = "${newValue}"`;
    }

    if (type === 'number' || type === 'boolean') {
      return `${indent}${name} = ${newValue}`;
    }

    return '';
  }
}
