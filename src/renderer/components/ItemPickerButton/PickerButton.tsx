import { Button, Tooltip } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import LazyTexture from '../lazy-texture/LazyTexture';
import { useAppStore } from '../../store/app.store';
import { ItemModel } from '../../core/models/item.model';
import getTextureFromModel from '../../core/domains/minecraft/helpers/get-texture-from-model';
import getModelType from '../../core/domains/minecraft/helpers/get-model-type';
import TextureBox from '../texture-box/TextureBox';
import { PickerType } from '../../typings/picker-type.enum';
import getImageComponentFromPickerType from '../../core/domains/minecraft/helpers/get-image-component-from-picker-type';

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
  const press = async () => {
    const picked = await ipcRenderer.invoke('open', 'picker', type);
    if (picked === null) return;
    onPick(picked);
  };

  const projectId = useAppStore((st) => st.selectedProjectId)!;

  return (
    <Tooltip
      isDisabled={!value}
      content={value || ''}
      closeDelay={0}
      offset={-10}
      className="pointer-events-none"
    >
      <Button onPress={press} className={className}>
        {!value && 'Pick'}
        {value && getImageComponentFromPickerType(type, value, projectId)}
      </Button>
    </Tooltip>
  );
}
