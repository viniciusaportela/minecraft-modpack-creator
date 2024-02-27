import { Button } from '@nextui-org/react';
import { ipcRenderer } from 'electron';

interface PickerButtonProps {
  value: string | null;
  onPick: (value: string) => void;
}

export default function PickerButton({ value, onPick }: PickerButtonProps) {
  const onPress = async () => {
    const picked = await ipcRenderer.invoke('open', 'picker');
    if (picked) {
      onPick(picked);
    }
  };

  return (
    <Button variant="solid" className="drop-shadow-xl w-56" onPress={onPress}>
      <span>{value ?? 'Select'}</span>
    </Button>
  );
}
