import StreamZip from 'node-stream-zip';
import { stat } from 'node:fs/promises';
import { ipcRenderer } from 'electron';
import { Types } from 'realm';
import { useAppStore } from '../../../../store/app.store';
import { ModModel } from '../../../models/mod.model';

export class TextureLoader {
  static cachedZips = new Map<string, StreamZip.StreamZipAsync>();

  async load(projectId: Types.ObjectId, textureId: string) {
    const path = await this.getFullTextureSource(textureId);

    const imageExists = await stat(path)
      .then(() => true)
      .catch(() => false);
    if (imageExists) return;

    const zip = await this.getZip(projectId, textureId);

    const [modId, insidePath] = textureId.split(':');
    await zip.extract(
      `assets/${modId}/textures/${insidePath}.png`,
      await this.getFullTextureSource(textureId),
    );
  }

  getTextureSource(textureId: string) {
    if (!textureId) {
      return undefined;
    }

    const modId = textureId.split(':')[0];
    const splitted = textureId.replace(`${modId}:`, '').split('/');
    const lastPart = splitted.splice(-1, 1)[0];

    return `textures://${modId}/${splitted.join('_')}${splitted.length > 0 ? '__' : ''}${lastPart}.png`;
  }

  async getFullTextureSource(textureId: string) {
    const modId = textureId.split(':')[0];
    const splitted = textureId.replace(`${modId}:`, '').split('/');
    const lastPart = splitted.splice(-1, 1)[0];

    const dataFolder = await ipcRenderer.invoke('getPath', 'userData');

    return `${dataFolder}/textures/${modId}/${splitted.join('_')}__${lastPart}.png`;
  }

  private async getZip(projectId: Types.ObjectId, textureId: string) {
    const modId = textureId.split(':')[0];

    const zipPath = useAppStore
      .getState()
      .realm.objects<ModModel>('Mod')
      .filtered('modId = $0 AND project = $1', modId, projectId)[0]?.jarPath;

    if (!zipPath) {
      console.warn(`getZip: mod with id ${modId} not found`);
    }

    const cachedZip = TextureLoader.cachedZips.get(zipPath);

    if (cachedZip) return cachedZip;

    const zip = new StreamZip.async({ file: zipPath });
    TextureLoader.cachedZips.set(zipPath, zip);

    return zip;
  }
}
