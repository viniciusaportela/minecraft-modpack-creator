import { PickerType } from '../../../../typings/picker-type.enum';
import Block3D from '../../../../components/block-3d/Block3D';
import LazyTexture from '../../../../components/lazy-texture/LazyTexture';
import { useItemsStore } from '../../../../store/items.store';

// TODO turn this as a component instead
export default function getImageComponentFromPickerType(
  type: PickerType,
  value: string,
) {
  if (type === PickerType.Item) {
    const item = useItemsStore((st) => st.items.find((i) => i.id === value));

    const modId = item?.mod;
    const withoutModId = value.split(':')[1];

    const texturePath = `${modId}/textures/${item?.isBlock ? 'block' : 'item'}/${withoutModId}.png`;

    return item?.isBlock ? (
      <Block3D path={texturePath} className="h-6 w-6" />
    ) : (
      <LazyTexture path={texturePath} className="h-6 w-6" />
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
    return <LazyTexture path={value} className="h-6 w-6" />;
  }

  return <LazyTexture path={null} className="h-6 w-6" />;
}
