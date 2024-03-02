export interface IMod {
  generateConfig(): Promise<Record<string, unknown>>;

  getVersion(): number;

  migrateConfig(oldConfig: Record<string, unknown>): Record<string, unknown>;

  getUserConfigs(): Promise<Record<string, unknown>>;
}
