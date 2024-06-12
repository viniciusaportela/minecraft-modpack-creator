import { RefinedField, Writer } from '../../interfaces/parser';
import { EmptyWriter } from './empty-writer';

export abstract class BaseParser {
  abstract isFileValid(
    rawData: string | Buffer,
  ): Promise<{ isValid: boolean; error: any }>;

  canParseFields() {
    return false;
  }

  parseFields(rawData: string | Buffer): RefinedField[] {
    return [];
  }

  getFieldWriter(path: string): Writer {
    return new EmptyWriter();
  }
}
