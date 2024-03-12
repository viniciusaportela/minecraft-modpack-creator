import StreamZip, { StreamZipAsync } from 'node-stream-zip';
import toml from 'toml';
import {
  IProcessBlockContext,
  IProcessItemContext,
} from './interfaces/jar-loader.interface';
import { IModsToml } from './interfaces/mods-toml.interface';
import isJSONValid from '../../../helpers/isJSONValid';

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

  async isMinecraft() {
    return !(await this.getMetadata());
  }

  async getMetadata(): Promise<IModsToml | undefined> {
    try {
      const rawToml = await this.zip.entryData('META-INF/mods.toml');
      return toml.parse(rawToml.toString());
    } catch (error) {
      console.warn('Error while reading mods.toml', error);
      return undefined;
    }
  }

  async processTextures(
    perTextureCallback: (texturePath: string) => Promise<void>,
  ) {
    const entries = await this.zip.entries();
    const textures = Object.values(entries).filter(
      (e) =>
        /assets\/.*\/textures/g.test(e.name) &&
        e.name.endsWith('.png') &&
        e.isFile,
    );

    const promises = textures.map(async (texture) => {
      await perTextureCallback(texture.name);
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
      let modelJson = {};
      const rawJson = (await this.zip.entryData(block.name)).toString();
      if (isJSONValid(rawJson)) {
        modelJson = JSON.parse(rawJson);
      }

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
      let modelJson = {};
      const rawJson = (await this.zip.entryData(item.name)).toString();
      if (isJSONValid(rawJson)) {
        modelJson = JSON.parse(rawJson);
      }

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
