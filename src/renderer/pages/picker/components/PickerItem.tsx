import { Button, Image } from '@nextui-org/react';
import { CSSProperties } from 'react';
import { Types } from 'realm';
import { BlockModel } from '../../../core/models/block.model';
import { ItemModel } from '../../../core/models/item.model';
import LazyTexture from '../../../components/lazy-image/LazyTexture';

interface PickerItemProps {
  projectId: Types.ObjectId;
  item: ItemModel;
  onPress: () => void;
  style: CSSProperties;
}

export default function PickerItem({
  item,
  onPress,
  style,
  projectId,
}: PickerItemProps) {
  const getItemTexture = () => {
    return item.getModel()?.textures?.layer0;
  };

  return (
    <Button
      key={item.name}
      className="justify-start min-h-7 h-7"
      variant="light"
      style={style}
      onPress={onPress}
    >
      <LazyTexture
        textureId={getItemTexture()}
        projectId={projectId}
        className="w-5 h-5 mr-1"
      />
      {item.name}
    </Button>
  );
}
