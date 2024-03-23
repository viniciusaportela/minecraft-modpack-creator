import path from 'path';
import { readFile } from 'node:fs/promises';
import { BaseDirectory } from '../base/base-directory';
import { MinecraftDirectory } from '../minecraft/minecraft-directory';
import { NullModMetadata } from '../base/null-mod-metadata';
import { NullMetadata } from '../base/null-metadata';

export interface ISKLauncherManifest {
  minecraft: {
    version: string;
    modLoaders: { id: string; primary: boolean }[];
  };
  manifestType: string;
  manifestVersion: number;
  name: string;
  version: string;
  author: string;
  files: { projectID: number; fileID: string; required: boolean }[];
  overrides: string;
}

export class SKLauncherDirectory extends BaseDirectory {
  async getMinecraftJarPath(): Promise<string> {
    const meta = await this.readMetadata().then((m) => m.getRaw());

    const minecraftVersion = meta.minecraft.version;
    const minecraftPath = this.modpackFolder.split('/').slice(0, -2).join('/');
    const minecraftDir = new MinecraftDirectory(minecraftPath);

    return minecraftDir.getMinecraftJarPathByVersion(minecraftVersion);
  }

  async readMetadata(): Promise<NullMetadata> {
    const manifestPath = path.join(this.modpackFolder, 'manifest.json');

    const metadata = await readFile(manifestPath, 'utf-8').then((data) =>
      JSON.parse(data),
    );

    return new NullMetadata(metadata);
  }
}
