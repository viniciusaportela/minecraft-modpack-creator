import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { X } from '@phosphor-icons/react';
import { usePager } from '../../../components/pager/hooks/usePager';
import PickerButton from '../../../components/ItemPickerButton/PickerButton';
import { PickerType } from '../../../typings/picker-type.enum';

interface ShapedRecipeProps {
  json: string;
  onChange?: (json: string) => void;
  onAdded?: () => void;
}

export default function ShapedRecipe({
  json,
  onChange,
  onAdded,
}: ShapedRecipeProps) {
  const { navigate } = usePager();

  const [input, setInput] = useState<(string | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [outputCount, setOutputCount] = useState(1);
  const [output, setOutput] = useState<string | null>(null);

  const onPickInput = (value: string, row: number, col: number) => {
    setInput((prev) => {
      const copy = [...prev];
      copy[row][col] = value === '@custom:removeItem' ? null : value;
      return copy;
    });
  };

  const addRecipe = () => {
    // const recipes = project.getRecipes();
    // recipes.push({
    //   type: 'shaped',
    //   input,
    //   output: output!,
    //   outputCount,
    // });
    // project.setRecipes(recipes);

    onAdded?.();
  };

  const hasAnyInput = () => {
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[i].length; j++) {
        if (input[i][j]) return true;
      }
    }
    return false;
  };

  return (
    <div className="flex flex-col">
      <span className="text-lg font-bold mb-2">Input</span>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <PickerButton
            value={input[0][0]}
            onPick={(value) => onPickInput(value, 0, 0)}
            type={PickerType.Item}
          />
          <PickerButton
            value={input[0][1]}
            onPick={(value) => onPickInput(value, 0, 1)}
            type={PickerType.Item}
          />
          <PickerButton
            value={input[0][2]}
            onPick={(value) => onPickInput(value, 0, 2)}
            type={PickerType.Item}
          />
        </div>
        <div className="flex gap-1">
          <PickerButton
            value={input[1][0]}
            onPick={(value) => onPickInput(value, 1, 0)}
            type={PickerType.Item}
          />
          <PickerButton
            value={input[1][1]}
            onPick={(value) => onPickInput(value, 1, 1)}
            type={PickerType.Item}
          />
          <PickerButton
            value={input[1][2]}
            onPick={(value) => onPickInput(value, 1, 2)}
            type={PickerType.Item}
          />
        </div>
        <div className="flex gap-1">
          <PickerButton
            value={input[2][0]}
            onPick={(value) => onPickInput(value, 2, 0)}
            type={PickerType.Item}
          />
          <PickerButton
            value={input[2][1]}
            onPick={(value) => onPickInput(value, 2, 1)}
            type={PickerType.Item}
          />
          <PickerButton
            value={input[2][2]}
            onPick={(value) => onPickInput(value, 2, 2)}
            type={PickerType.Item}
          />
        </div>
      </div>

      <span className="text-lg font-bold mb-2 mt-4">Output</span>
      <div className="flex items-center">
        <Input
          type="number"
          className="w-16"
          size="sm"
          value={String(outputCount)}
          onValueChange={(value) => setOutputCount(parseInt(value, 10))}
          placeholder="1"
          classNames={{
            inputWrapper: 'h-10 px-3',
          }}
        />
        <X className="mx-1" />
        <PickerButton
          value={output}
          onPick={(picked) => setOutput(picked)}
          className="w-[225px]"
          type={PickerType.Item}
        />
      </div>

      <Button
        color="primary"
        className="w-full mt-4"
        onPress={addRecipe}
        isDisabled={!output || !hasAnyInput()}
      >
        Add recipe
      </Button>
    </div>
  );
}
