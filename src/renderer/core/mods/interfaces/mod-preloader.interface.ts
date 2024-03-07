export interface IModPreloader {
  generateConfig(): Promise<Record<string, unknown>>;

  getUserConfigs(): Promise<Record<string, unknown>>;
}
