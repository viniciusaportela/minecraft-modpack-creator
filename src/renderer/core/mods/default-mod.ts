import { existsSync } from 'node:fs';
import toml from 'toml';
import { readFile } from 'node:fs/promises';
import { IMod } from './interfaces/mod.interface';
import JarLoader from '../minecraft/jar-loader';
import { ICurseMetadata } from '../minecraft/interfaces/curse-metadata.interface';

export class DefaultMod implements IMod {
  private jar: JarLoader;

  private modId: string;

  constructor(jar: JarLoader, modId: string) {
    this.jar = jar;
    this.modId = modId;
  }

  async generateConfig() {
    const curseMeta = (await this.getCurseMetadata())!;
    return {
      version: this.getVersion(),
      configs: await this.getUserConfigs(),
      thumbnail: curseMeta.thumbnailUrl,
      website: curseMeta.webSiteURL,
    };
  }

  getVersion(): number {
    return 1;
  }

  migrateConfig(oldConfig: Record<string, unknown>): Record<string, unknown> {
    return {
      ...this.generateConfig(),
      ...oldConfig,
      version: this.getVersion(),
    };
  }

  async getCurseMetadata() {
    const modpackFolder = this.jar.jarPath.replace(/mods\/.*/g, '');
    const curseMeta = JSON.parse(
      await readFile(`${modpackFolder}/minecraftinstance.json`, 'utf-8'),
    ) as ICurseMetadata;

    return curseMeta.installedAddons.find(
      (addon) => addon.fileNameOnDisk === this.jar.jarPath.split('/').pop(),
    );
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
