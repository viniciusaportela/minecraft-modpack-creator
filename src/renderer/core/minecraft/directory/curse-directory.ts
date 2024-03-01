import path from 'path';
import { readFile } from 'node:fs/promises';
import { BaseDirectory } from './base-directory';
import { ICurseMetadata } from '../interfaces/curse-metadata.interface';

export class CurseDirectory extends BaseDirectory {
  async getMinecraftJarPath() {
    const initialPart = this.modpackFolder.split('Instances')[0];
    const { gameVersion } = await this.getMetadata();

    return path.join(
      initialPart,
      'Install',
      'versions',
      gameVersion,
      `${gameVersion}.jar`,
    );
  }

  async getMetadata(): Promise<ICurseMetadata> {
    const instancePath = path.join(
      this.modpackFolder,
      'minecraftinstance.json',
    );
    return JSON.parse(await readFile(instancePath, 'utf-8'));
  }
}
