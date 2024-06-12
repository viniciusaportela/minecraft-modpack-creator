import { Button } from '@nextui-org/react';
import { CSSProperties } from 'react';
import getImageComponentFromPickerType from '../../../core/domains/minecraft/helpers/get-image-component-from-picker-type';
import { PickerType } from '../../../typings/picker-type.enum';
import { IItem } from '../../../store/interfaces/items-store.interface';
import { IBlock } from '../../../store/interfaces/blocks-store.interface';
import { ITexture } from '../../../store/interfaces/textures-store.interface';

interface PickerItemProps {
  item: IItem | IBlock | ITexture;
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
    return (item as IItem | IBlock).name || (item as ITexture).id;
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
