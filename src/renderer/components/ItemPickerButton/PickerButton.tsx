import { Button, Tooltip } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import { PickerType } from '../../typings/picker-type.enum';
import getImageComponentFromPickerType from '../../core/domains/minecraft/helpers/get-image-component-from-picker-type';
import { useAppStore } from '../../store/app.store';

interface ItemPickerProps {
  value: string | null;
  onPick: (value: string) => void;
  type: PickerType;
  className?: string;
}

export default function PickerButton({
  value,
  type,
  onPick,
  className,
}: ItemPickerProps) {
  const projectIdx = useAppStore((st) => st.selectedProjectIndex);

  const onPress = async () => {
    const picked = await ipcRenderer.invoke('open', 'picker', projectIdx, type);
    if (picked === null) return;
    onPick(picked);
  };

  return (
    <Tooltip
      isDisabled={!value}
      content={value || ''}
      closeDelay={0}
      offset={-10}
      className="pointer-events-none"
    >
      <Button onPress={onPress} className={className}>
        {!value && 'Pick'}
        {value && getImageComponentFromPickerType(type, value)}
      </Button>
    </Tooltip>
  );
}
