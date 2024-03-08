export default function getModelType(model: any) {
  if (model?.parent && model?.parent.includes(':block/')) {
    return 'block';
  }

  return 'item';
}
