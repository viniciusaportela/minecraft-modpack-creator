import { Button } from '@nextui-org/react';
import { CSSProperties } from 'react';
import MinecraftTexture from '../../../components/minecraft-texture/minecraft-texture';
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
  const getValueFromType = () => {
    return (item as IItem | IBlock).id || (item as ITexture).id;
  };

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
      <MinecraftTexture type={type} value={getValueFromType()} />
      {getNameFromType()}
    </Button>
  );
}
