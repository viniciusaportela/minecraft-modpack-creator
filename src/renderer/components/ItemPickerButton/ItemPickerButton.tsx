import { Button, Tooltip } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import LazyTexture from '../lazy-image/LazyTexture';
import { useAppStore } from '../../store/app.store';
import { ItemModel } from '../../core/models/item.model';
import getTextureFromModel from '../../core/domains/minecraft/helpers/getTextureFromModel';
import getModelType from '../../core/domains/minecraft/helpers/getModelType';
import TextureBox from '../texture-box/TextureBox';

interface ItemPickerProps {
  value: string | null;
  onPick: (value: string) => void;
  className?: string;
}

export default function ItemPickerButton({
  value,
  onPick,
  className,
}: ItemPickerProps) {
  const press = async () => {
    const picked = await ipcRenderer.invoke('open', 'picker');
    if (picked === null) return;
    onPick(picked);
  };

  const projectId = useAppStore((st) => st.selectedProjectId)!;
  const realm = useAppStore((st) => st.realm)!;

  const item = realm
    .objects<ItemModel>(ItemModel.schema.name)
    .filtered('itemId = $0 AND project = $1', value, projectId)[0];

  const modelType = getModelType(item?.getModel());

  return (
    <Tooltip
      isDisabled={!value}
      content={value || ''}
      closeDelay={0}
      offset={-10}
      className="pointer-events-none"
    >
      <Button onPress={press} className={className}>
        {value &&
          item &&
          (modelType === 'block' ? (
            <TextureBox
              textureId={getTextureFromModel(
                item.getModel(),
                'block',
                item.getParent(),
              )}
              className="h-6 w-6"
            />
          ) : (
            <LazyTexture
              textureId={getTextureFromModel(item.getModel(), 'item')}
              className="h-6 w-6"
            />
          ))}
        {!value && 'Pick'}
      </Button>
    </Tooltip>
  );
}
