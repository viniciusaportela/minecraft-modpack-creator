import { IMod } from '../../domains/minecraft/interfaces/curse-metadata.interface';

export interface IModPreloader {
  generateConfig(): Promise<Record<string, unknown>>;

  getUserConfigs(): Promise<Record<string, unknown>>;

  getCurseMetadata(): Promise<IMod | null>;
}
