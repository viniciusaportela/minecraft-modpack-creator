import path from 'path';
import { readFile } from 'node:fs/promises';
import { BaseDirectory } from '../base/base-directory';
import { ICurseMetadata } from '../../minecraft/interfaces/curse-metadata.interface';

export class CurseforgeDirectory extends BaseDirectory {
  async getMinecraftJarPath() {
    const initialPart = this.modpackFolder.split('Instances')[0];
    const { gameVersion } = await this.readMetadata();

    return path.join(
      initialPart,
      'Install',
      'versions',
      gameVersion,
      `${gameVersion}.jar`,
    );
  }

  async readMetadata(): Promise<ICurseMetadata> {
    const instancePath = path.join(
      this.modpackFolder,
      'minecraftinstance.json',
    );
    return JSON.parse(await readFile(instancePath, 'utf-8'));
  }
}
