export interface IBlockStore {
  blocks: IBlock[];
  version: number;
}

export interface IBlock {
  mod: string;
  name: string;
  id: string;
  index: number;
}
