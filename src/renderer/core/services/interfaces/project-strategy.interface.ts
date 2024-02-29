export interface IProjectStrategy {
  handle(modpackFolder: string): Promise<void>;
}
