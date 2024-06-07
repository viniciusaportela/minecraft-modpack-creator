export interface IItemsStore {
  items: IItem[];
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
