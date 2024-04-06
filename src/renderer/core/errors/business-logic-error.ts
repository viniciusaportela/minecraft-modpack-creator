import { BusinessError } from './business-error.enum';

export default class BusinessLogicError extends Error {
  constructor({
    code,
    message,
    meta,
  }: {
    code: BusinessError;
    message: string;
    meta?: any;
  }) {
    super(message);
    this.name = 'BusinessLogicError';
    this.message = message;
    this.code = code;
    this.meta = meta;
  }

  message: string;

  code: BusinessError;

  meta?: any;

  toString() {
    return `${this.code}: ${this.message}`;
  }
}
