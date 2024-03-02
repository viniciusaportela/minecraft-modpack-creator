import { DefaultMod } from './default-mod';

export class SkillTreeMod extends DefaultMod {
  async generateConfig() {
    return {
      ...(await super.generateConfig()),
      tree: {
        nodes: [],
        edges: [],
      },
    };
  }

  getVersion(): number {
    return 1;
  }
}
