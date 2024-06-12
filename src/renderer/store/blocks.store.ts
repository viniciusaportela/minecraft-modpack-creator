import { create } from 'zustand';
import { IBlock, IBlockStore } from './interfaces/blocks-store.interface';

export const useBlocksStore = create<IBlockStore>(() => ({
  blocks: [],
  version: 1,
}));
