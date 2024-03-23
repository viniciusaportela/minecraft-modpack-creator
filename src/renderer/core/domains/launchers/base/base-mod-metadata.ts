export abstract class BaseModMetadata<TMetadata = any> {
  constructor(protected readonly modMetadata: TMetadata) {}

  abstract getThumbnail(): string | null;

  abstract getWebsite(): string | null;
}
