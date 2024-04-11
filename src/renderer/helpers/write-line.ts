import { readFile, writeFile } from 'node:fs/promises';

export default async function writeLine(
  filePath: string,
  line: number,
  newContent: string,
) {
  const content = await readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  lines[line - 1] = newContent;
  await writeFile(filePath, lines.join('\n'));
}
