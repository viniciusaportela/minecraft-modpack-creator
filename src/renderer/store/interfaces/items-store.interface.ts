export interface IItemsStore {
  items: IItem[];
  findItem: (id: string) => IItem | undefined;
  version: number;
}

export interface IItem {
  mod: string;
  name: string;
  id: string;
  index: number;
  isBlock: boolean;
  blockName?: string;
  blockId?: string;
}
