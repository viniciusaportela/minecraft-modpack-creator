import { Warning } from '@phosphor-icons/react';
import { memo } from 'react';
import { FieldsRenderer } from './fields/FieldsRenderer';
import { useRefinedConfig } from '../../../../core/domains/minecraft/config/RefinedConfigContext';

const RefinedConfigEditor = memo(() => {
  const fieldsExists = useRefinedConfig((state) => !!state.fields);
  const fieldsLength = useRefinedConfig((state) => state.fields.length);

  if (!fieldsExists)
    return (
      <div className="bg-danger-300 mt-3 p-3 rounded-md flex items-center drop-shadow-md">
        <Warning size={20} weight="bold" />
        <span className="ml-2">
          An error occurred while parsing the config file. Try using the Raw
          Editor
        </span>
      </div>
    );

  if (!fieldsLength) {
    return (
      <div className="w-full h-full flex items-center justify-center p-5">
        <i className="text-zinc-500">There is nothing to edit here</i>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex flex-col">
      <div className="-mt-4">
        <FieldsRenderer path={[]} />
      </div>
    </div>
  );
});

export default RefinedConfigEditor;
