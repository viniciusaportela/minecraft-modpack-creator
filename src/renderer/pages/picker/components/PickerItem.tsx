import { Button, Image } from '@nextui-org/react';
import { CSSProperties } from 'react';
import { BlockModel } from '../../../core/models/block.model';

interface PickerItemProps {
  block: BlockModel;
  onPress: () => void;
  style: CSSProperties;
}

export default function PickerItem({ block, onPress, style }: PickerItemProps) {
  return (
    <Button
      key={block.name}
      className="justify-start min-h-7 h-7"
      variant="light"
      style={style}
      onPress={onPress}
    >
      <Image src={block.image} className="w-5 h-5 mr-1" />
      {block.name}
    </Button>
  );
}
