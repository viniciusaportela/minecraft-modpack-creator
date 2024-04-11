export function countIndentation(line: string): number {
  if (line.startsWith('[')) {
    return 0;
  }

  if (!line.startsWith('\t')) {
    return 0;
  }

  const match = line.match(/^\t+/);
  return match ? match[0].length : 0;
}
