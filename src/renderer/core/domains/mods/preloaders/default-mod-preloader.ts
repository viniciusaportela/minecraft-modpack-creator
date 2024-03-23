import { existsSync } from 'node:fs';
import toml from 'toml';
import { readFile } from 'node:fs/promises';
import { IModPreloader } from '../interfaces/mod-preloader.interface';
import JarLoader from '../../minecraft/jar-loader';
import { ICurseMetadata } from '../../minecraft/interfaces/curse-metadata.interface';

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
      initialized: false,
    };
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
