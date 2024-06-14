export interface IRecipesStore {
  recipes: IRecipe[];
  types: string[];
  version: number;
}

export type IRecipe = { type?: string; filePath: string; index: number } & {
  [key: string]: any;
};
