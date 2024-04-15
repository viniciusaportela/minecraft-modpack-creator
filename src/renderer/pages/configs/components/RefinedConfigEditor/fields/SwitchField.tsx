import { Switch } from '@nextui-org/react';
import { useRefinedConfig } from '../../../../../core/domains/minecraft/config/RefinedConfigContext';
import { curriedReadByPath } from '../../../../../helpers/read-write-by-path';

interface SwitchFieldProps {
  path: string[];
  onUpdatedRefined?: () => void;
  filter?: string;
}

export default function SwitchField({
  path,
  onUpdatedRefined,
  filter,
}: SwitchFieldProps) {
  const config = useRefinedConfig(
    (st) => curriedReadByPath(st.fields)(path),
    true,
  );
  const write = useRefinedConfig((st) => st.write);

  if (filter && !config.name?.toLowerCase().includes(filter.toLowerCase())) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col">
      {config.comment && <span>{config.comment}</span>}
      <Switch
        isSelected={config.value === 'true' || config.value === true}
        onValueChange={(newValue) => {
          write(path, newValue, onUpdatedRefined);
        }}
      >
        {config.name}
      </Switch>
    </div>
  );
}
