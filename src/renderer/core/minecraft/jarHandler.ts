import { mkdir } from 'node:fs/promises';
import { ipcRenderer } from 'electron';
import Realm, { UpdateMode } from 'realm';
import path from 'path';
import JarLoader from './jar-loader';
import { TextureModel } from '../models/texture.model';
import { ProjectModel } from '../models/project.model';

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
    try {
      const dataFolder = await ipcRenderer.invoke('getPath', 'userData');
      await this.createBaseFolder();

      await this.jarLoader.processTextures(async (extract, texturePath) => {
        const modId = /assets\/(.*)\/textures\//g.exec(texturePath)?.[1];

        if (modId) {
          const splittedTexture = texturePath
            .replace(`assets/${modId}/textures/`, '')
            .split('/');
          const textureName = splittedTexture.splice(-1)[0];

          const modpackTexturesFolder = path.join(
            dataFolder,
            'textures',
            modId,
          );
          await mkdir(modpackTexturesFolder, { recursive: true });

          const finalPath = path.join(
            modpackTexturesFolder,
            `${splittedTexture.join('_')}__${textureName}`,
          );
          await extract(finalPath);
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
        } else {
          console.warn(`No mod id found in ${texturePath}`);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async handleBlocks() {
    await this.createBaseFolder();
  }

  async handleItems() {
    await this.createBaseFolder();
  }

  private async createBaseFolder() {
    const dataFolder = await ipcRenderer.invoke('getPath', 'userData');

    const modpackTexturesFolder = path.join(dataFolder, 'textures');

    await mkdir(modpackTexturesFolder, { recursive: true });
  }
}
