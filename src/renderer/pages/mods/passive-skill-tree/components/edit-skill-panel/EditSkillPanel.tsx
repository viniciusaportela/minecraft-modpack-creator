import {
  Button,
  Card,
  CardBody,
  Input,
  Switch,
  useDisclosure,
} from '@nextui-org/react';
import React from 'react';
import { X } from '@phosphor-icons/react';
import PickerButton from '../../../../../components/ItemPickerButton/PickerButton';
import { PickerType } from '../../../../../typings/picker-type.enum';
import BonusModal from '../bonus/BonusModal';
import { useModConfigSelector } from '../../../../../store/hooks/use-mod-config-selector';

interface EditSkillPanelProps {
  focusedNodePath: string[];
  onClose: () => void;
}

export default function EditSkillPanel({
  focusedNodePath,
  onClose,
}: EditSkillPanelProps) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const [focusedNodeData] = useModConfigSelector([
    ...(focusedNodePath ?? []),
    'data',
  ]);

  const [title, setTitle] = useModConfigSelector([
    ...(focusedNodePath ?? []),
    'data',
    'title',
  ]);

  const [titleColor, setTitleColor] = useModConfigSelector([
    ...(focusedNodePath ?? []),
    'data',
    'titleColor',
  ]);

  const [iconTexture, setIconTexture] = useModConfigSelector([
    ...(focusedNodePath ?? []),
    'data',
    'iconTexture',
  ]);

  const [backgroundTexture, setBackgroundTexture] = useModConfigSelector([
    ...(focusedNodePath ?? []),
    'data',
    'backgroundTexture',
  ]);

  const [borderTexture, setBorderTexture] = useModConfigSelector([
    ...(focusedNodePath ?? []),
    'data',
    'borderTexture',
  ]);

  const [buttonSize, setButtonSize] = useModConfigSelector([
    ...(focusedNodePath ?? []),
    'data',
    'buttonSize',
  ]);

  const [isStartingPoint, setIsStartingPoint] = useModConfigSelector([
    ...(focusedNodePath ?? []),
    'data',
    'isStartingPoint',
  ]);

  if (!focusedNodeData) return null;

  return (
    <>
      <Card className="absolute right-2 top-2 w-72">
        <CardBody>
          <div className="flex items-center mb-2">
            <h1 className="font-bold">Edit Skill</h1>
            <Button
              variant="flat"
              isIconOnly
              size="sm"
              className="ml-auto"
              onPress={onClose}
            >
              <X />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Input
              label="Title"
              size="sm"
              variant="bordered"
              placeholder="Skill title"
              value={title}
              onValueChange={(value) => {
                setTitle(value);
              }}
            />
            <div className="flex items-center">
              <span className="text-sm">Title Color:</span>
              <input
                type="color"
                className="ml-auto"
                value={`#${titleColor?.toLowerCase() ?? '#ffffff'}`}
                onChange={(e) => {
                  setTitleColor(e.target.value?.toUpperCase().replace('#', ''));
                }}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm">Icon Texture:</span>
              <PickerButton
                type={PickerType.Texture}
                className="h-8 ml-auto"
                value={iconTexture ?? 'skilltree:textures/icons/void'}
                onPick={(value) => setIconTexture(value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm">Background Texture:</span>
              <PickerButton
                type={PickerType.SkillTreeBackground}
                className="h-8 ml-auto"
                value={
                  backgroundTexture ??
                  'skilltree:textures/icons/background/lesser'
                }
                onPick={(value) => setBackgroundTexture(value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm">Border Texture:</span>
              <PickerButton
                type={PickerType.SkillTreeBorder}
                className="h-8 ml-auto"
                value={borderTexture ?? 'skilltree:textures/tooltip/lesser'}
                onPick={(value) => setBorderTexture(value)}
              />
            </div>
            <Input
              label="Button Size"
              size="sm"
              variant="bordered"
              value={buttonSize}
              onValueChange={(text) =>
                !Number.isNaN(parseFloat(text))
                  ? setButtonSize(parseFloat(text))
                  : setButtonSize(undefined)
              }
            />

            <Switch
              size="sm"
              isSelected={isStartingPoint}
              onValueChange={(isSelected) => setIsStartingPoint(isSelected)}
            >
              Is starting point
            </Switch>

            <span>Bonuses</span>
            <Button onPress={onOpen}>Edit bonus</Button>
          </div>
        </CardBody>
      </Card>
      <BonusModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        focusedNodePath={focusedNodePath}
      />
    </>
  );
}
