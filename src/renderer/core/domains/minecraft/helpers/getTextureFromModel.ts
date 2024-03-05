export default function getTextureFromModel(
  model: Record<string, any>,
  modelType: 'block' | 'item',
  parentModel?: Record<string, any>,
) {
  console.log('getTextureFromModel', model, modelType, parentModel);
  if (
    modelType === 'block' &&
    parentModel?.parent === 'minecraft:block/cube_all'
  ) {
    return parentModel.textures.all;
  }

  if (modelType === 'item') {
    return model?.textures?.layer0;
  }

  return undefined;
}
