export interface RefinedField {
  name: string;
  value: (string | number | boolean) | (string | number | boolean)[];
  lineNumber: number;
  comment?: string;
  indentation: number;
  array?: boolean;
  type: 'string' | 'group' | 'number' | 'boolean' | 'aggr-comment' | 'unknown';
  range?: [number, number];
  children?: RefinedField[];
}

export interface ParseContext {
  last?: RefinedField;
  lastGroup?: RefinedField;
  lineNumber: number;
  lines: string[];
}

export interface ParseResult {
  operation: 'add' | 'replace';
  result: RefinedField;
}

export interface Writer {
  write(field: RefinedField, newValue: any): Promise<void>;
}
