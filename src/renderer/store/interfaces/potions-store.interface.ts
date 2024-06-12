export interface IPotionsStore {
  potions: IPotion[];
  version: number;
}

export type IPotion = {
  id: string;
  index: number;
} & { [key: string]: any };
