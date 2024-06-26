export interface ITexturesStore {
  textures: ITexture[];
  version: number;
}

export interface ITexture {
  id: string;
  outPath: string;
  internalPath: string;
  modId: string;
  index: number;
}
