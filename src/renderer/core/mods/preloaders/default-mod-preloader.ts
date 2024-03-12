import { existsSync } from 'node:fs';
import toml from 'toml';
import { readFile } from 'node:fs/promises';
import { IModPreloader } from '../interfaces/mod-preloader.interface';
import JarLoader from '../../domains/minecraft/jar-loader';
import { ICurseMetadata } from '../../domains/minecraft/interfaces/curse-metadata.interface';

export class DefaultModPreloader implements IModPreloader {
  private jar: JarLoader;

  private modId: string;

  constructor(jar: JarLoader, modId: string) {
    this.jar = jar;
    this.modId = modId;
  }

  async generateConfig(): Promise<Record<string, unknown>> {
    return {
      configs: await this.getUserConfigs(),
    };
  }

  async getCurseMetadata() {
    try {
      const modpackFolder = this.jar.jarPath.replace(/mods\/.*/g, '');
      const curseMeta = JSON.parse(
        await readFile(`${modpackFolder}/minecraftinstance.json`, 'utf-8'),
      ) as ICurseMetadata;

      return curseMeta.installedAddons.find(
        (addon) => addon.fileNameOnDisk === this.jar.jarPath.split('/').pop(),
      )!;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  async getUserConfigs(): Promise<Record<string, unknown>> {
    const { jarPath } = this.jar;
    const jarName = jarPath.split('/').pop()!.replace('.jar', '');
    const configFolder = jarPath.replace(jarName, 'config');

    const clientConfigPath = `${configFolder}/${this.modId}-client.toml`;
    const serverConfigPath = `${configFolder}/${this.modId}-server.toml`;
    const commonConfigPath = `${configFolder}/${this.modId}-common.toml`;

    let clientConfig = null;
    let serverConfig = null;
    let commonConfig = null;

    if (existsSync(clientConfigPath)) {
      clientConfig = toml.parse(await readFile(clientConfigPath, 'utf-8'));
    }

    if (existsSync(serverConfigPath)) {
      serverConfig = toml.parse(await readFile(serverConfigPath, 'utf-8'));
    }

    if (existsSync(commonConfigPath)) {
      commonConfig = toml.parse(await readFile(commonConfigPath, 'utf-8'));
    }

    return {
      server: serverConfig,
      client: clientConfig,
      common: commonConfig,
    };
  }
}
