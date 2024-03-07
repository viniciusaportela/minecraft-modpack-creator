import { Button } from '@nextui-org/react';
import { CSSProperties } from 'react';
import { ItemModel } from '../../../core/models/item.model';
import LazyTexture from '../../../components/lazy-texture/LazyTexture';
import getTextureFromModel from '../../../core/domains/minecraft/helpers/getTextureFromModel';
import TextureBox from '../../../components/texture-box/TextureBox';
import getModelType from '../../../core/domains/minecraft/helpers/getModelType';

interface PickerItemProps {
  item: ItemModel;
  onPress: () => void;
  style: CSSProperties;
}

export default function PickerItem({ item, onPress, style }: PickerItemProps) {
  const itemType = getModelType(item.getModel());

  return (
    <Button
      key={item.name}
      className="justify-start min-h-7 h-7"
      variant="light"
      style={style}
      onPress={onPress}
    >
      {itemType === 'block' && (
        <TextureBox
          textureId={getTextureFromModel(
            item.getModel(),
            'block',
            item.getParent(),
          )}
          className="w-5 h-5 mr-0.5 ml-0.5"
        />
      )}
      {itemType === 'item' && (
        <LazyTexture
          textureId={getTextureFromModel(item.getModel(), 'item')}
          className="w-5 h-5"
        />
      )}
      {item.name}
    </Button>
  );
}
