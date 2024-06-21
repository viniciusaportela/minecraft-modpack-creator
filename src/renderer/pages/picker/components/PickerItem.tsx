import { Button } from '@nextui-org/react';
import { CSSProperties } from 'react';
import { Tag } from '@phosphor-icons/react';
import MinecraftTexture from '../../../components/minecraft-texture/minecraft-texture';
import { PickerType } from '../../../typings/picker-type.enum';
import { IItem } from '../../../store/interfaces/items-store.interface';
import { IBlock } from '../../../store/interfaces/blocks-store.interface';
import { ITexture } from '../../../store/interfaces/textures-store.interface';
import { ITag } from '../../../store/interfaces/tags-store.interface';

interface PickerItemProps {
  item: IItem | IBlock | ITexture | ITag;
  type: PickerType;
  onPress?: () => void;
  style: CSSProperties;
}

export default function PickerItem({
  item,
  onPress,
  style,
  type,
}: PickerItemProps) {
  const getValueFromType = () => {
    if (type === PickerType.Item) {
      return (item as IItem).id;
    }

    return (item as ITag).name || (item as IBlock | ITexture).id;
  };

  const getNameFromType = () => {
    return (item as IItem | IBlock | ITag).name || (item as ITexture).id;
  };

  return (
    <Button
      key={getNameFromType()}
      className="justify-start min-h-7 h-7 gap-0"
      variant="light"
      style={style}
      onPress={onPress}
    >
      <MinecraftTexture type={type} value={getValueFromType()} />
      <div className="w-3" />
      {getNameFromType()}
      {type === PickerType.Tag && (
        <Tag weight="fill" className="text-primary" />
      )}
    </Button>
  );
}
