import { Button, Image } from '@nextui-org/react';
import { VanillaItemsBlocks } from '../../pages/picker/constants/vanilla-items-blocks';

interface ItemPickerProps {
  value: string | null;
  onPick: (value: string) => void;
}

export default function ItemPicker({ value, onPick }: ItemPickerProps) {
  const icon = value
    ? VanillaItemsBlocks.find((block) => block.id === value)?.image
    : null;

  const press = async () => {
    const picked = await window.ipcRenderer.invoke('openPicker');
    onPick(picked);
  };

  return (
    <Button onPress={press}>
      {icon && <Image src={icon} className="w-5 h-5" />}
      {!icon && value}
      {!value && 'Pick'}
    </Button>
  );
}
