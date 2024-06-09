import { IBaseModConfig } from '../../../../../store/interfaces/mod-config.interface';

export interface ISkillTreeConfig extends IBaseModConfig {
  // TODO type
  tree: {
    nodes: any[];
    edges: any[];
    mainTree: { skillIds: any[]; id: string };
  };
}
