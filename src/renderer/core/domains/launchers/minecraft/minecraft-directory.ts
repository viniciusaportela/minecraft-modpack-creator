import path from 'path';
import { BaseDirectory } from '../base/base-directory';
import { useAppStore } from '../../../../store/app.store';
import { GlobalStateModel } from '../../../models/global-state.model';
import { ProjectModel } from '../../../models/project.model';
import { NullMetadata } from '../base/null-metadata';

export class MinecraftDirectory extends BaseDirectory {
  async getMinecraftJarPath(): Promise<string> {
    const { realm } = useAppStore.getState();
    const globalState = realm.objects<GlobalStateModel>('GlobalState')[0];
    const projectId = globalState.selectedProjectId;
    const project = realm.objectForPrimaryKey<ProjectModel>(
      'Project',
      projectId,
    );

    if (!project) {
      console.warn("Can't determine minecraft version without project");
      return '';
    }

    const version = project.minecraftVersion;

    return this.getMinecraftJarPathByVersion(version);
  }

  getMinecraftJarPathByVersion(version: string) {
    return path.join(this.modpackFolder, 'versions', version, `${version}.jar`);
  }

  async readMetadata(): Promise<any> {
    return new NullMetadata({});
  }
}
