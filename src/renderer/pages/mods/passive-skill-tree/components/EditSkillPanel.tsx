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
import PickerButton from '../../../../components/ItemPickerButton/PickerButton';
import { PickerType } from '../../../../typings/picker-type.enum';
import BonusModal from './bonus/BonusModal';
import { useModConfigByPath } from '../../../../hooks/use-mod-config';

interface EditSkillPanelProps {
  focusedNodePath: string;
  onClose: () => void;
}

export default function EditSkillPanel({
  focusedNodePath,
  onClose,
}: EditSkillPanelProps) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [focusedNode, setFocusedNode] = useModConfigByPath(focusedNodePath);

  if (!focusedNode) return null;

  const formatTextureInput = (texture: string) => {
    return texture.replace('.png', '').replace('textures/', '');
  };

  const formatTextureOutput = (texture: string) => {
    const [modId, path] = texture.split(':');
    return `${modId}:textures/${path}.png`;
  };

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
              value={focusedNode.data.title}
              onValueChange={(value) =>
                setFocusedNode({
                  ...focusedNode,
                  data: { ...focusedNode.data, title: value },
                })
              }
            />
            <div className="flex items-center">
              <span className="text-sm">Title Color:</span>
              <input
                type="color"
                className="ml-auto"
                value={`#${focusedNode.data.titleColor?.toLowerCase() ?? 'ffffff'}`}
                onChange={(e) => {
                  setFocusedNode({
                    ...focusedNode,
                    data: {
                      ...focusedNode.data,
                      titleColor: e.target.value
                        ?.toUpperCase()
                        .replace('#', ''),
                    },
                  });
                }}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm">Icon Texture:</span>
              <PickerButton
                type={PickerType.Texture}
                className="h-8 ml-auto"
                value={
                  formatTextureInput(focusedNode.data.iconTexture) ??
                  'skilltree:icons/void'
                }
                onPick={(value) =>
                  setFocusedNode({
                    ...focusedNode,
                    data: {
                      ...focusedNode.data,
                      iconTexture: formatTextureOutput(value),
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm">Background Texture:</span>
              <PickerButton
                type={PickerType.SkillTreeBackground}
                className="h-8 ml-auto"
                value={
                  formatTextureInput(focusedNode.data.backgroundTexture) ??
                  'skilltree:icons/background/lesser'
                }
                onPick={(value) =>
                  setFocusedNode({
                    ...focusedNode,
                    data: {
                      ...focusedNode.data,
                      backgroundTexture: formatTextureOutput(value),
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm">Border Texture:</span>
              <PickerButton
                type={PickerType.SkillTreeBorder}
                className="h-8 ml-auto"
                value={
                  formatTextureInput(focusedNode.data.borderTexture) ??
                  'skilltree:tooltip/lesser'
                }
                onPick={(value) =>
                  setFocusedNode({
                    ...focusedNode,
                    data: {
                      ...focusedNode.data,
                      borderTexture: formatTextureOutput(value),
                    },
                  })
                }
              />
            </div>
            <Input
              label="Button Size"
              size="sm"
              variant="bordered"
              placeholder="16"
              value={focusedNode.data.buttonSize ?? 16}
              onValueChange={(text) =>
                setFocusedNode({
                  ...focusedNode,
                  data: {
                    ...focusedNode.data,
                    buttonSize: parseFloat(text),
                  },
                })
              }
            />

            <Switch
              size="sm"
              isSelected={focusedNode.data.isStartingPoint}
              onValueChange={(isSelected) =>
                setFocusedNode({
                  ...focusedNode,
                  data: {
                    ...focusedNode.data,
                    isStartingPoint: isSelected,
                  },
                })
              }
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
