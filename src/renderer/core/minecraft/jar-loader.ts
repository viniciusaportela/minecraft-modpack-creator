import StreamZip, { StreamZipAsync } from 'node-stream-zip';
import * as toml from 'toml';
import { IModsToml } from './interfaces/mods-toml.interface';
import { IProcessItemContext } from './interfaces/jar-loader.interface';

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

  async processTextures(
    perTextureCallback: (
      extract: (outputPath: string) => Promise<void>,
      texturePath: string,
    ) => Promise<void>,
  ) {
    const entries = await this.zip.entries();
    const textures = Object.values(entries).filter(
      (e) => /assets\/.*\/textures/g.test(e.name) && e.name.endsWith('.png'),
    );

    for await (const texture of textures) {
      await perTextureCallback(async (outputPath: string) => {
        await this.zip.extract(texture.name, outputPath);
      }, texture.name);
    }
  }

  async processBlocks() {}

  async processItems(
    perItemCallback: (context: IProcessItemContext) => Promise<void>,
  ) {
    const entries = await this.zip.entries();
    const items = Object.values(entries).filter((e) =>
      /assets\/.*\/models\/item/g.test(e.name),
    );

    for await (const item of items) {
      const modelJson = JSON.parse(
        (await this.zip.entryData(item.name)).toString(),
      );

      const fullItemId = item.name.replace(/assets\/.*\/models\/item\//g, '');

      await perItemCallback({
        fullItemId,
        itemId: fullItemId.split('/')[1],
        modelJson,
      });
    }
  }
}
