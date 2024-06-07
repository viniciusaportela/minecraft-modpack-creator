import { IProject } from '../../../store/interfaces/project.interface';
import { IMod } from '../../../store/interfaces/mods-store.interface';
import { IBaseModConfig } from '../../../store/interfaces/mod-config.interface';

export class DefaultMod {
  constructor(
    protected readonly project: IProject,
    protected readonly mod: IMod,
    protected readonly modConfig: IBaseModConfig,
  ) {}

  getId() {
    return this.mod.id;
  }

  async build() {}

  async preBuild() {}

  async postBuild() {}

  async makeConfig(): Promise<any> {
    return {};
  }
}
