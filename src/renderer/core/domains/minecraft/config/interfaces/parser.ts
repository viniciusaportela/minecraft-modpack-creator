export interface RefinedField {
  name: string;
  value: string;
  comment?: string;
  indentation?: number;
  type:
    | 'string'
    | 'group'
    | 'array'
    | 'number'
    | 'boolean'
    | 'aggr-comment'
    | 'unknown';
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
