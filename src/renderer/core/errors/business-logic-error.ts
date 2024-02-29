export default class BusinessLogicError extends Error {
  constructor({
    status,
    code,
    message,
    meta,
  }: {
    status: 'success' | 'error';
    code: string;
    message: string;
    meta?: any;
  }) {
    super(message);
    this.name = 'BusinessLogicError';
    this.message = message;
    this.code = code;
    this.status = status;
    this.meta = meta;
  }

  message: string;

  code: string;

  status: 'success' | 'error';

  meta?: any;

  toString() {
    return `${this.code}: ${this.message}`;
  }
}
