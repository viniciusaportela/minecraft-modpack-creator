import { Warning } from '@phosphor-icons/react';
import { ConfigNode } from '../../../../core/domains/minecraft/config/ConfigNode';
import { RefinedParseResult } from '../../../../core/domains/minecraft/config/interfaces/parser';
import { FieldsRenderer } from './fields/FieldsRenderer';

interface RefinedConfigEditorProps {
  config: ConfigNode;
}

const CHARS_TO_IGNORE = ['\t', '.', ','];

export default function RefinedConfigEditor({
  config,
}: RefinedConfigEditorProps) {
  const data = config.getData() as RefinedParseResult;

  if (data === null)
    return (
      <div className="bg-danger-300 mt-3 p-3 rounded-md flex items-center drop-shadow-md">
        <Warning size={20} weight="bold" />
        <span className="ml-2">
          An error occurred while parsing the config file. Try using the Raw
          Editor
        </span>
      </div>
    );

  console.log(data);
  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-5">
        <i className="text-zinc-500">There is nothing to edit here</i>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex flex-col">
      <div className="-mt-4">
        <FieldsRenderer fields={data} />
      </div>
    </div>
  );
}
