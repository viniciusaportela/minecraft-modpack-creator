export class ParseFailed {
  constructor(
    public readonly path: string,
    public readonly error: Error,
  ) {}
}
