export interface IProjectStrategy {
  createFromFolder(modpackFolder: string): Promise<void>;
}
