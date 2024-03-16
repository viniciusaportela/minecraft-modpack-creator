export function formatTextureOutput(texture: string) {
  const [modId, path] = texture.split(':');
  return `${modId}:textures/${path}.png`;
}
