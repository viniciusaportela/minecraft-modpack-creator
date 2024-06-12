import { useAppStore } from '../../../../store/app.store';

let instance: TextureLoader;

export class TextureLoader {
  static getInstance() {
    if (!instance) {
      instance = new TextureLoader();
    }
    return instance;
  }

  getTextureSource(textureId: string | null | undefined) {
    if (!textureId) {
      return undefined;
    }

    const withoutPng = textureId?.replace('.png', '');
    const withoutTextures = withoutPng?.replace('textures/', '');

    const projectPath = useAppStore.getState().selectedProject().path;

    const splittedTexture = withoutTextures.split(':');
    const modId = splittedTexture[0];
    const texturePath = splittedTexture[1];

    return `textures://${projectPath}/minecraft-toolkit/assets/${modId}/textures/${texturePath}.png`;
  }
}
