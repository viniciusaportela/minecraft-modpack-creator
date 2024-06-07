export interface ITexturesStore {
  textures: ITexture[];
  version: number;
}

export interface ITexture {
  outPath: string;
  internalPath: string;
  modId: string;
  index: number;
}
