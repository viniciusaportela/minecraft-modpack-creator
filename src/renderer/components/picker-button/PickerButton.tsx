import { Button } from '@nextui-org/react';

interface PickerButtonProps {
  value: string | null;
  onPick: (value: string) => void;
}

export default function PickerButton({ value, onPick }: PickerButtonProps) {
  const onPress = async () => {
    const picked = await window.ipcRenderer.invoke('openPicker');
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
