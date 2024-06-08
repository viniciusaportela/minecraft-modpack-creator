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

    // DEV
    return '';
  }
}
