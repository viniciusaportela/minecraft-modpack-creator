export interface ISkillTreeConfig {
  // TODO type
  tree: {
    nodes: any[];
    edges: any[];
    mainTree: { skillIds: any[]; id: string };
  };
}
