export interface IMod {
  generateConfig(): Promise<Record<string, unknown>>;

  getUserConfigs(): Promise<Record<string, unknown>>;
}
