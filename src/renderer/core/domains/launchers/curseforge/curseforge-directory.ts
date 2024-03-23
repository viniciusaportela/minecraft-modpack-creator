import path from 'path';
import { readFile } from 'node:fs/promises';
import { BaseDirectory } from '../base/base-directory';
import { CurseforgeMetadata } from './curseforge-metadata';

export class CurseforgeDirectory extends BaseDirectory {
  async getMinecraftJarPath() {
    const initialPart = this.modpackFolder.split('Instances')[0];
    const { gameVersion } = await this.readMetadata().then((m) => m.getRaw());

    return path.join(
      initialPart,
      'Install',
      'versions',
      gameVersion,
      `${gameVersion}.jar`,
    );
  }

  async readMetadata(): Promise<CurseforgeMetadata> {
    const instancePath = path.join(
      this.modpackFolder,
      'minecraftinstance.json',
    );
    const metadata = JSON.parse(await readFile(instancePath, 'utf-8'));
    return new CurseforgeMetadata(metadata);
  }
}
