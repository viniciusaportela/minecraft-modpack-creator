export interface IProjectStore {
  modpackFolder: string;
  recipes: {
    type: 'shaped';
    input: (string | null)[][];
    output: string;
    outputCount: number;
  }[];
  kubejsScripts: never[];
}
