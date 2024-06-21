export interface IRecipesStore {
  recipes: IRecipe[];
  types: string[];
  version: number;
}

export type IRecipe = {
  type?: string;
  filePath: string;
  index: number;
  mod: string;
  id: string;
} & {
  [key: string]: any;
};
