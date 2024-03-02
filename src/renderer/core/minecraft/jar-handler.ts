import { mkdir } from 'node:fs/promises';
import { ipcRenderer } from 'electron';
import Realm, { UpdateMode } from 'realm';
import path from 'path';
import JarLoader from './jar-loader';
import { TextureModel } from '../models/texture.model';
import { ProjectModel } from '../models/project.model';
import { ItemModel } from '../models/item.model';
import { BlockModel } from '../models/block.model';

export class JarHandler {
  private jarLoader: JarLoader;

  private realm: Realm;

  private project: ProjectModel;

  constructor(jarLoader: JarLoader, project: ProjectModel, realm: Realm) {
    this.jarLoader = jarLoader;
    this.project = project;
    this.realm = realm;
  }

  async handleTextures() {
    await this.createBaseFolder();
    const dataFolder = await ipcRenderer.invoke('getPath', 'userData');

    await this.jarLoader.processTextures(async (extract, texturePath) => {
      const modId = /assets\/(.*)\/textures\//g.exec(texturePath)?.[1];

      if (modId) {
        const splittedTexture = texturePath
          .replace(`assets/${modId}/textures/`, '')
          .split('/');
        const textureName = splittedTexture.splice(-1)[0];

        const modpackTexturesFolder = path.join(dataFolder, 'textures', modId);
        await mkdir(modpackTexturesFolder, { recursive: true });

        const finalPath = path.join(
          modpackTexturesFolder,
          `${splittedTexture.join('_')}__${textureName}`,
        );
        await extract(finalPath);
        this.realm.beginTransaction();
        const createdTexture = this.realm.create<TextureModel>(
          TextureModel.schema.name,
          {
            type: splittedTexture.join('/'),
            path: finalPath,
            textureId: `${modId}:${splittedTexture.join('_')}__${textureName}`,
            name: textureName,
            project: this.project,
          },
          UpdateMode.Modified,
        );

        if (
          !this.project.textures.find(
            (t) => t.textureId === createdTexture.textureId,
          )
        ) {
          this.project.textures.push(createdTexture);
        }
        this.realm.commitTransaction();
      } else {
        console.warn(`No mod id found in ${texturePath}`);
      }
    });
  }

  async handleBlocks() {
    await this.createBaseFolder();

    await this.jarLoader.processBlocks(async ({ fullBlockId, modelJson }) => {
      const createdBlock = this.realm.create<BlockModel>(
        BlockModel.schema.name,
        {
          name: fullBlockId,
          id: fullBlockId,
          model: JSON.stringify(modelJson),
          project: this.project,
        },
        UpdateMode.Modified,
      );

      if (!this.project.blocks.find((b) => b.id === createdBlock.id)) {
        this.project.blocks.push(createdBlock);
      }
    });
  }

  async handleItems() {
    await this.createBaseFolder();

    await this.jarLoader.processItems(async ({ fullItemId, modelJson }) => {
      const createdItem = this.realm.create<ItemModel>(
        ItemModel.schema.name,
        {
          id: fullItemId,
          project: this.project,
          name: fullItemId, // TODO get name from lang
          model: JSON.stringify(modelJson),
        },
        UpdateMode.Modified,
      );

      if (!this.project.items.find((i) => i.id === createdItem.id)) {
        this.project.items.push(createdItem);
      }
    });
  }

  private async createBaseFolder() {
    const dataFolder = await ipcRenderer.invoke('getPath', 'userData');

    const modpackTexturesFolder = path.join(dataFolder, 'textures');

    await mkdir(modpackTexturesFolder, { recursive: true });
  }
}
