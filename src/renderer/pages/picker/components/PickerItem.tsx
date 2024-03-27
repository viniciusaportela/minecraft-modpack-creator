import { Button } from '@nextui-org/react';
import { CSSProperties } from 'react';
import { ItemModel } from '../../../core/models/item.model';
import { BlockModel } from '../../../core/models/block.model';
import { TextureModel } from '../../../core/models/texture.model';
import getImageComponentFromPickerType from '../../../core/domains/minecraft/helpers/get-image-component-from-picker-type';
import { PickerType } from '../../../typings/picker-type.enum';

interface PickerItemProps {
  item: ItemModel | BlockModel | TextureModel;
  type: PickerType;
  onPress: () => void;
  style: CSSProperties;
}

export default function PickerItem({
  item,
  onPress,
  style,
  type,
}: PickerItemProps) {
  const getNameFromType = () => {
    if (item instanceof ItemModel) return item.itemId;
    if (item instanceof BlockModel) return item.blockId;
    return item.textureId;
  };

  return (
    <Button
      key={getNameFromType()}
      className="justify-start min-h-7 h-7"
      variant="light"
      style={style}
      onPress={onPress}
    >
      {getImageComponentFromPickerType(type, getNameFromType())}
      {getNameFromType()}
    </Button>
  );
}
