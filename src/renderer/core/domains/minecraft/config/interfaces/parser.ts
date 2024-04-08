export interface RefinedField {
  name: string;
  value: (string | number | boolean) | (string | number | boolean)[];
  comment?: string;
  indentation?: number;
  array?: boolean;
  type: 'string' | 'group' | 'number' | 'boolean' | 'aggr-comment' | 'unknown';
  range?: [number, number];
  children?: RefinedField[];
}

export type RefinedParseResult = RefinedField[];

export interface ParseContext {
  last?: RefinedField;
  index: number;
  lines: string[];
}

export interface ParseResult {
  operation: 'add' | 'replace';
  result: RefinedField;
}
