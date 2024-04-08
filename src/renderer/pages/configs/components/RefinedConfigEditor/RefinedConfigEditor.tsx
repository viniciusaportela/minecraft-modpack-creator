import { Card, Input, Switch } from '@nextui-org/react';
import { Warning } from '@phosphor-icons/react';
import { ConfigNode } from '../../../../core/domains/minecraft/config/ConfigNode';
import {
  RefinedField,
  RefinedParseResult,
} from '../../../../core/domains/minecraft/config/interfaces/parser';

interface RefinedConfigEditorProps {
  config: ConfigNode;
}

export function FieldsRenderer({ fields }: { fields: RefinedField[] }) {
  return fields
    ?.filter((field) => !['unknown', 'aggr-comment'].includes(field.type))
    .map((field) => {
      switch (field.type) {
        case 'string':
          return (
            <div className="mt-4 flex flex-col">
              {field.comment && <span className="mb-1">{field.comment}</span>}
              <Input value={field.value} label={field.name} />
            </div>
          );
        case 'number':
          return (
            <div className="mt-4 flex flex-col">
              {field.comment && <span className="mb-1">{field.comment}</span>}
              <Input value={field.value} type="number" label={field.name} />
            </div>
          );
        case 'boolean':
          return (
            <div className="mt-4 flex flex-col">
              {field.comment && <span className="mb-1">{field.comment}</span>}
              <Switch isSelected={field.value === 'true'}>{field.name}</Switch>
            </div>
          );
        case 'group':
          return (
            <div className="rounded-md border-1 mt-4 border-solid border-zinc-600 p-2">
              <span className="text-lg font-bold">{field.name}</span>
              <FieldsRenderer fields={field.children!} />
            </div>
          );
        default:
          return null;
      }
    });
}

export default function RefinedConfigEditor({
  config,
}: RefinedConfigEditorProps) {
  const data = config.getData() as RefinedParseResult;
  if (!Array.isArray(data))
    return (
      <div className="bg-danger-300 mt-3 p-3 rounded-md flex items-center drop-shadow-md">
        <Warning size={20} weight="bold" />
        <span className="ml-2">
          Probably a error occurred while parsing the config file.
        </span>
      </div>
    );

  return (
    <div className="overflow-y-auto flex flex-col">
      <FieldsRenderer fields={data} />
    </div>
  );
}
