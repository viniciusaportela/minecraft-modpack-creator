import { Button, Card, CardBody, Input, Switch } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { Node } from 'reactflow';
import { X } from '@phosphor-icons/react';
import PickerButton from '../../../../components/ItemPickerButton/PickerButton';
import { PickerType } from '../../../../typings/picker-type.enum';

interface EditSkillPanelProps {
  focusedNode: Node | null;
  setFlowNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onClose: () => void;
}

export default function EditSkillPanel({
  focusedNode,
  setFlowNodes,
  onClose,
}: EditSkillPanelProps) {
  const [internalFlowNode, setInternalFlowNode] = useState<Node | null>(
    focusedNode,
  );

  const updateFlowNode = (updateFn: (prev: Node) => Node) => {
    let prevValue = internalFlowNode;
    let newValue = updateFn(prevValue!);

    setFlowNodes((updatedPrev) => {
      prevValue = updatedPrev.find((n) => n.id === prevValue?.id) ?? prevValue;
      newValue = updateFn(prevValue!);
      return updatedPrev.map((n) => (n.id === prevValue!.id ? newValue : n));
    });

    setInternalFlowNode(newValue);
  };

  useEffect(() => {
    setInternalFlowNode(focusedNode);
  }, [focusedNode]);

  if (!focusedNode || !internalFlowNode) return null;

  const formatTextureInput = (texture: string) => {
    return texture.replace('.png', '').replace('textures/', '');
  };

  const formatTextureOutput = (texture: string) => {
    const [modId, path] = texture.split(':');
    return `${modId}:textures/${path}.png`;
  };

  return (
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
            value={internalFlowNode!.data.title}
            onValueChange={(value) =>
              updateFlowNode((prev) => ({
                ...prev,
                data: { ...prev.data, title: value },
              }))
            }
          />
          <div className="flex items-center">
            <span className="text-sm">Title Color:</span>
            <input
              type="color"
              className="ml-auto"
              value={`#${internalFlowNode!.data.titleColor?.toLowerCase() ?? 'ffffff'}`}
              onChange={(e) => {
                updateFlowNode((prev) => ({
                  ...prev!,
                  data: {
                    ...prev!.data,
                    titleColor: e.target.value?.toUpperCase().replace('#', ''),
                  },
                }));
              }}
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm">Icon Texture:</span>
            <PickerButton
              type={PickerType.Texture}
              className="h-8 ml-auto"
              value={
                formatTextureInput(internalFlowNode!.data.iconTexture) ??
                'skilltree:icons/void'
              }
              onPick={(value) =>
                updateFlowNode((prev) => ({
                  ...prev!,
                  data: {
                    ...prev!.data,
                    iconTexture: formatTextureOutput(value),
                  },
                }))
              }
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm">Background Texture:</span>
            <PickerButton
              type={PickerType.SkillTreeBackground}
              className="h-8 ml-auto"
              value={
                formatTextureInput(internalFlowNode!.data.backgroundTexture) ??
                'skilltree:icons/background/lesser'
              }
              onPick={(value) =>
                updateFlowNode((prev) => ({
                  ...prev!,
                  data: {
                    ...prev!.data,
                    backgroundTexture: formatTextureOutput(value),
                  },
                }))
              }
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm">Border Texture:</span>
            <PickerButton
              type={PickerType.SkillTreeBorder}
              className="h-8 ml-auto"
              value={
                formatTextureInput(internalFlowNode!.data.borderTexture) ??
                'skilltree:tooltip/lesser'
              }
              onPick={(value) =>
                updateFlowNode((prev) => ({
                  ...prev!,
                  data: {
                    ...prev!.data,
                    borderTexture: formatTextureOutput(value),
                  },
                }))
              }
            />
          </div>
          <Input
            label="Button Size"
            size="sm"
            variant="bordered"
            placeholder="16"
            value={internalFlowNode!.data.buttonSize ?? 16}
            onValueChange={(text) =>
              updateFlowNode((prev) => ({
                ...prev!,
                data: {
                  ...prev!.data,
                  buttonSize: parseFloat(text),
                },
              }))
            }
          />

          <Switch
            size="sm"
            isSelected={internalFlowNode!.data.isStartingPoint}
            onValueChange={(isSelected) =>
              updateFlowNode((prev) => ({
                ...prev!,
                data: {
                  ...prev!.data,
                  isStartingPoint: isSelected,
                },
              }))
            }
          >
            Is starting point
          </Switch>

          <span>Bonuses</span>
          <Button>Add bonus</Button>
        </div>
      </CardBody>
    </Card>
  );
}
