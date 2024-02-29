import StreamZip, { StreamZipAsync } from 'node-stream-zip';
import * as toml from 'toml';
import { IModsToml } from './interfaces/mods-toml';

export default class JarLoader {
  private jarPath: string;

  private zip!: StreamZipAsync;

  constructor(jarPath: string) {
    this.jarPath = jarPath;
  }

  static async load(jarPath: string) {
    const jar = new JarLoader(jarPath);
    return jar.initialize();
  }

  async initialize() {
    this.zip = new StreamZip.async({ file: this.jarPath });
    return this;
  }

  async getMetadata(): Promise<IModsToml> {
    const buffer = await this.zip.entryData('META-INF/mods.toml');
    return toml.parse(buffer.toString());
  }

  getTextures() {}

  getBlocks() {}

  getItems() {}
}
