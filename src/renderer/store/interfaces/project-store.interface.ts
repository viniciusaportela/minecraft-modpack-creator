export interface IProjectStore {
  recipes: any[];
  items: any[];
  blocks: any[];
  loaded: boolean;
  load: () => void;
}
