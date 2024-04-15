import { Autocomplete, AutocompleteItem, Input } from '@nextui-org/react';
import { memo } from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import CommentTooltip from './CommentTooltip';
import capitalize from '../../../../../helpers/capitalize';
import { useRefinedConfig } from '../../../../../core/domains/minecraft/config/RefinedConfigContext';
import { curriedReadByPath } from '../../../../../helpers/read-write-by-path';
import { RefinedField } from '../../../../../core/domains/minecraft/config/interfaces/parser';
import ColorPicker from '../../../../../components/color-picker/ColorPicker';

interface TextFieldProps {
  path: string[];
  onUpdatedRefined?: () => void;
  filter?: string;
}

const TextField = memo(({ path, onUpdatedRefined, filter }: TextFieldProps) => {
  const config = useRefinedConfig(
    (st) => curriedReadByPath<RefinedField>(st.fields)(path),
    true,
  );
  const write = useRefinedConfig((st) => st.write);

  const toReadableRange = (range: [number | undefined, number | undefined]) => {
    const [min, max] = range ?? [];
    return `${min ?? '-∞'} to ${max ?? '∞'}`;
  };

  const isColor = (txt: string) => {
    return /^#[0-9A-F]{3}([0-9A-F]{3})?$/i.test(txt);
  };

  console.log('TextField', filter, config.name);
  if (filter && !config.name?.toLowerCase().includes(filter.toLowerCase())) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col">
      <span>
        {capitalize(config.name ?? '')}{' '}
        {config.comment && <CommentTooltip comment={config.comment} />}
      </span>

      {config.allowedValues ? (
        <Autocomplete
          size="sm"
          allowsCustomValue
          label={config.name}
          inputValue={config.value as string}
          endContent={
            isColor(config.value as string) ? (
              <ColorPicker
                value={config.value as string}
                onChange={(color) => {
                  write(path, color, onUpdatedRefined);
                }}
              />
            ) : undefined
          }
          onInputChange={async (txt) => {
            write(path, txt, onUpdatedRefined);
          }}
        >
          {config.allowedValues!.map((allowedValue) => (
            <AutocompleteItem key={allowedValue}>
              {allowedValue}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      ) : (
        <Input
          value={config.value as string}
          size="sm"
          endContent={
            isColor(config.value as string) ? (
              <ColorPicker
                value={config.value as string}
                onChange={(color) => {
                  write(path, color, onUpdatedRefined);
                }}
              />
            ) : undefined
          }
          onValueChange={(txt) => write(path, txt, onUpdatedRefined)}
          type={config.type === 'number' ? 'number' : 'text'}
        />
      )}

      {config.range && (
        <div className="flex items-center mt-0.5">
          <WarningCircle size={14} />
          <span className="ml-0.5 text-xs mt-[1px]">
            Range: {toReadableRange(config.range)}
          </span>
        </div>
      )}
    </div>
  );
});

export default TextField;
