import { Writer } from '../interfaces/parser';

export class EmptyWriter implements Writer {
  async write(): Promise<void> {}
}
