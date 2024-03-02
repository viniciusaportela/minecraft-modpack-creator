import StreamZip, { StreamZipAsync } from 'node-stream-zip';
import toml from 'toml';
import {
  IProcessBlockContext,
  IProcessItemContext,
} from './interfaces/jar-loader.interface';
import { IModsToml } from './interfaces/mods-toml.interface';

export default class JarLoader {
  readonly jarPath: string;

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
    const rawToml = await this.zip.entryData('META-INF/mods.toml');
    return toml.parse(rawToml.toString());
  }

  async processTextures(
    perTextureCallback: (
      extract: (outputPath: string) => Promise<void>,
      texturePath: string,
    ) => Promise<void>,
  ) {
    const entries = await this.zip.entries();
    const textures = Object.values(entries).filter(
      (e) =>
        /assets\/.*\/textures/g.test(e.name) &&
        e.name.endsWith('.png') &&
        e.isFile,
    );

    const promises = textures.map(async (texture) => {
      await perTextureCallback(async (outputPath: string) => {
        await this.zip.extract(texture.name, outputPath);
      }, texture.name);
    });

    return Promise.all(promises);
  }

  async processBlocks(
    perBlockCallback: (context: IProcessBlockContext) => Promise<void>,
  ) {
    const entries = await this.zip.entries();
    const blocks = Object.values(entries).filter(
      (e) =>
        /assets\/.*\/models\/block/g.test(e.name) &&
        e.isFile &&
        e.name.endsWith('.json'),
    );

    for await (const block of blocks) {
      console.log('block', block);
      const modelJson = JSON.parse(
        (await this.zip.entryData(block.name)).toString(),
      );

      const modId = /assets\/(.*)\/models\/block/g.exec(block.name)?.[1];
      const blockId = block.name
        .replace(/assets\/.*\/models\/block\//g, '')
        .replace('.json', '');

      await perBlockCallback({
        fullBlockId: `${modId}:${blockId}`,
        modelJson,
      });
    }
  }

  async processItems(
    perItemCallback: (context: IProcessItemContext) => Promise<void>,
  ) {
    const entries = await this.zip.entries();
    const items = Object.values(entries).filter(
      (e) =>
        /assets\/.*\/models\/item/g.test(e.name) &&
        e.isFile &&
        e.name.endsWith('.json'),
    );

    for await (const item of items) {
      const modelJson = JSON.parse(
        (await this.zip.entryData(item.name)).toString(),
      );

      const modId = /assets\/(.*)\/models\/item/g.exec(item.name)?.[1];
      const itemId = item.name
        .replace(/assets\/.*\/models\/item\//g, '')
        .replace('.json', '');

      await perItemCallback({
        fullItemId: `${modId}:${itemId}`,
        modelJson,
      });
    }
  }
}
