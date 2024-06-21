import { Button, Tooltip } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import { PickerType } from '../../typings/picker-type.enum';
import MinecraftTexture from '../minecraft-texture/minecraft-texture';
import { useAppStore } from '../../store/app.store';

interface ItemPickerProps {
  value: string | null;
  onPick: (value: string, type: PickerType) => void;
  type: PickerType;
  className?: string;
  variant?: 'default' | 'ghost';
}

export default function PickerButton({
  value,
  type,
  onPick,
  variant,
  className,
}: ItemPickerProps) {
  const projectIdx = useAppStore((st) => st.selectedProjectIndex);

  const onPress = async () => {
    const pickedData = await ipcRenderer.invoke(
      'open',
      'picker',
      projectIdx,
      type,
    );
    if (pickedData === null) return;

    const [pickedType, pickedId] = pickedData.split('&');

    onPick(pickedId, pickedType);
  };

  return (
    <Tooltip
      isDisabled={!value}
      content={<span className="pointer-events-none">{value || ''}</span>}
      closeDelay={0}
      className="tooltip-not-selectable"
      offset={-10}
    >
      <Button
        onPress={onPress}
        className={className}
        variant={variant === 'ghost' ? 'light' : undefined}
      >
        {!value && variant !== 'ghost' && 'Pick'}
        {value && <MinecraftTexture type={type} value={value} />}
      </Button>
    </Tooltip>
  );
}
