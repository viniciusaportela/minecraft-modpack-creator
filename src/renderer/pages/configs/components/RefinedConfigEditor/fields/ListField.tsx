import { memo, useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { Plus, X } from '@phosphor-icons/react';
import { useRefinedConfig } from '../../../../../core/domains/minecraft/config/RefinedConfigContext';
import { curriedReadByPath } from '../../../../../helpers/read-write-by-path';
import { RefinedField } from '../../../../../core/domains/minecraft/config/interfaces/parser';
import capitalize from '../../../../../helpers/capitalize';
import CommentTooltip from './CommentTooltip';

interface ListFieldProps {
  path: string[];
  onUpdatedRefined?: () => void;
  filter?: string;
}

const ListField = memo(({ path, onUpdatedRefined, filter }: ListFieldProps) => {
  const [input, setInput] = useState('');
  const config = useRefinedConfig(
    (st) => curriedReadByPath<RefinedField>(st.fields)(path),
    true,
  );
  const write = useRefinedConfig((st) => st.write);

  const getValues = (): string[] => {
    const valuesOnly = (config.value as string).replaceAll(/[\[\]]/g, '');

    if (valuesOnly === '') {
      return [];
    }

    return valuesOnly.split(',').map((v: string) => {
      const trimmed = v.trim();

      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1);
      }

      return trimmed;
    });
  };

  const values = getValues();

  const saveValues = (values: string[]) => {
    let stringified = values;

    if (config.type === 'string') {
      stringified = values.map((v) => `"${v}"`);
    }

    write(path, `[${stringified.join(',')}]`, onUpdatedRefined);
    setInput('');
  };

  const onAdd = () => {
    const valuesWithNew = [...values, input];
    saveValues(valuesWithNew);
  };

  const onRemove = (index: number) => {
    const valuesWithout = values.filter((_, i) => i !== index);
    saveValues(valuesWithout);
  };

  console.log('list', values);

  if (filter && !config.name?.toLowerCase().includes(filter.toLowerCase())) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col">
      <span>
        {capitalize(config.name ?? '')}{' '}
        {config.comment && <CommentTooltip comment={config.comment} />}
      </span>
      <div className="flex">
        <Input
          value={input}
          size="sm"
          onValueChange={(txt) => setInput(txt)}
          type={config.type === 'number' ? 'number' : 'text'}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              onAdd();
            }
          }}
        />
        <Button
          color="primary"
          isIconOnly
          onPress={onAdd}
          isDisabled={input.trim() === ''}
          className="h-[48px] min-w-[48px] ml-1"
        >
          <Plus size={18} />
        </Button>
      </div>

      <div className="flex flex-col gap-1 mt-1">
        {values.map((value, index) => (
          <div
            className="flex items-center justify-between bg-zinc-800 rounded-md pl-3 pr-1"
            key={index}
          >
            {value}
            <Button
              variant="light"
              isIconOnly
              size="sm"
              onPress={() => onRemove(index)}
            >
              <X size={20} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ListField;
