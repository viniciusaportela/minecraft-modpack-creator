export class TextureLoader {
  private static instance: TextureLoader;

  static getInstance() {
    if (!TextureLoader.instance) {
      TextureLoader.instance = new TextureLoader();
    }
    return TextureLoader.instance;
  }

  getTextureSource(textureId: string | null | undefined) {
    if (!textureId) {
      return undefined;
    }

    // DEV
    return '';
  }
}
