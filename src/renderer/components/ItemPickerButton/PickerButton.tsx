import { Button, Tooltip } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import { PickerType } from '../../typings/picker-type.enum';
import PickerImage from '../picker-image/picker-image';
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
      content={<span className="pointer-events-none">{value || ''}</span>}
      closeDelay={0}
      className="tooltip-not-selectable"
      offset={-10}
    >
      <Button onPress={onPress} className={className}>
        {!value && 'Pick'}
        {value && <PickerImage type={type} value={value} />}
      </Button>
    </Tooltip>
  );
}
