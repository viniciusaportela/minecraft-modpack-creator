import { PickerType } from '../../../../typings/picker-type.enum';
import { ItemModel } from '../../../models/item.model';
import getModelType from './get-model-type';
import TextureBox from '../../../../components/texture-box/TextureBox';
import getTextureFromModel from './get-texture-from-model';
import LazyTexture from '../../../../components/lazy-texture/LazyTexture';
import { useAppStore } from '../../../../store/app.store';
import { GlobalStateModel } from '../../../models/global-state.model';

// TODO turn this as a component instead
export default function getImageComponentFromPickerType(
  type: PickerType,
  value: string,
) {
  const { realm } = useAppStore.getState();
  const projectId = realm.objects(GlobalStateModel.schema.name)[0]
    .selectedProjectId;

  if (type === PickerType.Item) {
    const item = realm
      .objects<ItemModel>(ItemModel.schema.name)
      .filtered('itemId = $0 AND project = $1', value, projectId)[0];

    const modelType = getModelType(item?.getModel());

    return modelType === 'block' ? (
      <TextureBox
        textureId={getTextureFromModel(
          item.getModel(),
          'block',
          item.getParent(),
        )}
        className="h-6 w-6"
      />
    ) : (
      <LazyTexture
        textureId={getTextureFromModel(item.getModel(), 'item')}
        className="h-6 w-6"
      />
    );
  }

  if (
    [
      PickerType.Texture,
      PickerType.SkillTreeBackground,
      PickerType.SkillTreeBorder,
      PickerType.SkillTreeIcon,
    ].includes(type)
  ) {
    return <LazyTexture textureId={value} className="h-6 w-6" />;
  }

  return <LazyTexture textureId={null} className="h-6 w-6" />;
}
