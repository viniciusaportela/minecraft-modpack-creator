import { Button, Input } from '@nextui-org/react';
import { ArrowFatRight } from '@phosphor-icons/react';
import PickerButton from '../../../components/ItemPickerButton/PickerButton';
import { PickerType } from '../../../typings/picker-type.enum';
import CraftingTableTop from '../../../assets/crafting-table-top.png';

interface ShapedRecipeProps {
  json: string;
  onChange?: (json: string) => void;
  onAdded?: () => void;
}

interface IShaped {
  type: 'minecraft:crafting_shaped';
  category: string;
  key: Record<string, { item?: string; tag?: string }>;
  pattern: string[];
  result: {
    item: string;
    count?: number;
  };
  show_notification?: boolean;
}

export default function ShapedRecipe({
  json,
  onChange,
  onAdded,
}: ShapedRecipeProps) {
  const parsed: IShaped = JSON.parse(json);

  const normalizePattern = (pattern: string[]) => {
    const normalized = [];

    for (let row = 0; row < 3; row++) {
      const curRow: (string | null)[] = [];

      for (let col = 0; col < 3; col++) {
        const gottenChar = pattern?.[row]?.[col];

        if (gottenChar) {
          curRow.push(parsed.key[gottenChar]?.item ?? null);
          continue;
        }

        curRow.push(null);
      }

      normalized.push(curRow);
    }

    console.log('normalized', pattern, 'to', normalized);
    return normalized;
  };

  const getInput = () => {
    const pattern = parsed?.pattern;

    if (!pattern) {
      return [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];
    }

    return normalizePattern(pattern);
  };

  const getOutput = () => {
    const output = parsed?.result?.item ?? null;
    const outputCount = parsed?.result?.count;

    const setOutput = (newOutput: string) => {
      parsed.result.item = newOutput;
      onChange?.(JSON.stringify(parsed, null, 2));
    };
    const setOutputCount = (newOutputCount: number) => {
      parsed.result.count = newOutputCount || undefined;
      onChange?.(JSON.stringify(parsed, null, 2));
    };

    return { output, outputCount, setOutput, setOutputCount };
  };

  const input = getInput();
  const { output, outputCount, setOutput, setOutputCount } = getOutput();

  const convertInputToJson = (inputToConvert: (string | null)[][]) => {
    console.log('converting', inputToConvert, 'to json');
    const key: IShaped['key'] = {};
    const POSSIBLE_KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    const pattern = ['   ', '   ', '   '];

    for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
      const row = inputToConvert[rowIdx];

      for (let colIdx = 0; colIdx < 3; colIdx++) {
        const item = row[colIdx];

        if (!item) {
          continue;
        }

        const [itemKey] =
          Object.entries(key).find(
            ([_, val]) => val.item === item || val.tag === item,
          ) ?? [];

        console.log(`in ${rowIdx},${colIdx} (${item}) has item key?`, itemKey);

        if (itemKey) {
          const fullStr = pattern[rowIdx];
          console.log(`has key ${itemKey}, fullstr:`, `"${fullStr}"`);

          console.log('oldPattern', JSON.stringify(pattern, null, 2));
          pattern[rowIdx] =
            fullStr.substring(0, colIdx) +
            itemKey +
            fullStr.substring(colIdx + 1);

          console.log('newPattern', JSON.stringify(pattern, null, 2));
          continue;
        }

        const keyChar = POSSIBLE_KEYS.shift();

        if (keyChar) {
          // TODO has to consider if item is actually a tag
          key[keyChar] = { item };
          console.log('new keychar', `"${keyChar}"`, 'new key', key);
          console.log('oldPattern', JSON.stringify(pattern, null, 2));
          pattern[rowIdx] =
            pattern[rowIdx].substring(0, colIdx) +
            keyChar +
            pattern[rowIdx].substring(colIdx + 1);
          console.log('newPattern', JSON.stringify(pattern, null, 2));
        } else {
          console.error('No more possible keys');
          break;
        }
      }
    }

    return { pattern, key };
  };

  const onPickInput = (value: string, row: number, col: number) => {
    input[row][col] = value === '@custom:removeItem' ? null : value;

    const { pattern, key } = convertInputToJson(input);

    console.log('converted', pattern, key);

    parsed.pattern = pattern;
    parsed.key = key;

    onChange?.(JSON.stringify(parsed, null, 2));
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
      <div className="flex items-center">
        <div className="flex flex-col gap-1 relative">
          <div
            className="pixelated w-[260px] h-[260px]"
            style={{
              backgroundImage: `url(${CraftingTableTop})`,
              backgroundSize: 'cover',
            }}
          />

          <PickerButton
            value={input[0][0]}
            onPick={(value) => onPickInput(value, 0, 0)}
            type={PickerType.Item}
            variant="ghost"
            className="absolute left-[55px] top-[55px] h-[50px] w-[50px] min-w-0 min-h-0"
          />
          <PickerButton
            value={input[0][1]}
            onPick={(value) => onPickInput(value, 0, 1)}
            type={PickerType.Item}
            variant="ghost"
            className="absolute left-[105px] top-[55px] h-[50px] w-[50px] min-w-0 min-h-0"
          />
          <PickerButton
            value={input[0][2]}
            onPick={(value) => onPickInput(value, 0, 2)}
            type={PickerType.Item}
            variant="ghost"
            className="absolute left-[155px] top-[55px] h-[50px] w-[50px] min-w-0 min-h-0"
          />

          <PickerButton
            value={input[1][0]}
            onPick={(value) => onPickInput(value, 1, 0)}
            type={PickerType.Item}
            variant="ghost"
            className="absolute left-[55px] top-[105px] h-[50px] w-[50px] min-w-0 min-h-0"
          />
          <PickerButton
            value={input[1][1]}
            onPick={(value) => onPickInput(value, 1, 1)}
            type={PickerType.Item}
            variant="ghost"
            className="absolute left-[105px] top-[105px] h-[50px] w-[50px] min-w-0 min-h-0"
          />
          <PickerButton
            value={input[1][2]}
            onPick={(value) => onPickInput(value, 1, 2)}
            type={PickerType.Item}
            variant="ghost"
            className="absolute left-[155px] top-[105px] h-[50px] w-[50px] min-w-0 min-h-0"
          />

          <PickerButton
            value={input[2][0]}
            onPick={(value) => onPickInput(value, 2, 0)}
            type={PickerType.Item}
            variant="ghost"
            className="absolute left-[55px] top-[155px] h-[50px] w-[50px] min-w-0 min-h-0"
          />
          <PickerButton
            value={input[2][1]}
            onPick={(value) => onPickInput(value, 2, 1)}
            type={PickerType.Item}
            variant="ghost"
            className="absolute left-[105px] top-[155px] h-[50px] w-[50px] min-w-0 min-h-0"
          />
          <PickerButton
            value={input[2][2]}
            onPick={(value) => onPickInput(value, 2, 2)}
            type={PickerType.Item}
            variant="ghost"
            className="absolute left-[155px] top-[155px] h-[50px] w-[50px] min-w-0 min-h-0"
          />
        </div>

        <ArrowFatRight className="mx-12" weight="fill" size={40} />

        <div className="flex flex-col items-center gap-2">
          <PickerButton
            value={output}
            onPick={setOutput}
            type={PickerType.Item}
            className="w-[50px] h-[50px] min-w-0 min-h-0 outline-1 outline-zinc-700"
            variant="ghost"
          />
          <Input
            type="number"
            className="w-16"
            size="sm"
            value={String(outputCount)}
            onValueChange={(value) => setOutputCount(parseInt(value, 10))}
            placeholder="1"
            classNames={{
              inputWrapper: 'h-10',
            }}
          />
        </div>
      </div>

      <Button
        color="primary"
        className="w-full mt-4"
        onPress={() => onAdded?.()}
        isDisabled={!output || !hasAnyInput()}
      >
        Add recipe
      </Button>
    </div>
  );
}
