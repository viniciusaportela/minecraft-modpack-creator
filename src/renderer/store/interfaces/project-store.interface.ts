import { IMod } from './mods-store.interface';

export interface IProjectStore {
  recipes: ICustomRecipe[];
  items: any[];
  blocks: any[];
  loaded: boolean;
  openedTabs: IMod[];
  focusedTab: string;
  load: () => void;
}

export interface ICustomRecipe {}
