import path from 'path';
import { useAppStore } from '../../../../store/app.store';

let instance: TextureLoader;

export class TextureLoader {
  static getInstance() {
    if (!instance) {
      instance = new TextureLoader();
    }
    return instance;
  }

  getTextureSourceFromItem(itemId: string) {
    return this.getTextureSource(this.getTextureFromItem(itemId));
  }

  getTextureFromItem(itemId: string) {
    const itemSplitted = itemId.split(':');

    const modId = itemSplitted[0];
    const itemName = itemSplitted[1];

    return `${modId}:textures/item/${itemName}.png`;
  }

  getTextureFromBlock(blockId: string) {
    const blockSplitted = blockId.split(':');

    const modId = blockSplitted[0];
    const blockName = blockSplitted[1];

    return `${modId}:textures/block/${blockName}.png`;
  }

  getTextureSource(textureId: string | null | undefined, isURI?: boolean) {
    if (!textureId) {
      return undefined;
    }

    const withoutPng = textureId?.replace('.png', '');
    const withoutTextures = withoutPng?.replace('textures/', '');

    const projectPath = useAppStore.getState().selectedProject().path;

    const splittedTexture = withoutTextures.split(':');
    const modId = splittedTexture[0];
    const texturePath = splittedTexture[1];

    const osCompatiblePath =
      process.platform === 'win32' && !isURI
        ? path.win32.normalize(texturePath)
        : texturePath;

    const extraSlashesForURI = isURI ? `${path.sep}${path.sep}` : '';

    const separator = isURI ? '/' : path.sep;
    const projectPathConsideringUri = isURI
      ? projectPath.replaceAll('\\', '/')
      : projectPath;

    return `textures:${path.sep}${path.sep}${extraSlashesForURI}${projectPathConsideringUri}${separator}minecraft-toolkit${separator}assets${separator}${modId}${separator}textures${separator}${osCompatiblePath}.png`;
  }
}
