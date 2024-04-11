import { Switch } from '@nextui-org/react';
import { useRefinedConfig } from '../../../../../core/domains/minecraft/config/RefinedConfigContext';
import { curriedReadByPath } from '../../../../../helpers/read-write-by-path';

interface SwitchFieldProps {
  path: string[];
}

export default function SwitchField({ path }: SwitchFieldProps) {
  const config = useRefinedConfig(
    (st) => curriedReadByPath(st.fields)(path),
    true,
  );
  const write = useRefinedConfig((st) => st.write);

  return (
    <div className="mt-4 flex flex-col">
      {config.comment && <span>{config.comment}</span>}
      <Switch
        isSelected={config.value === 'true' || config.value === true}
        onValueChange={(newValue) => write(path, newValue)}
      >
        {config.name}
      </Switch>
    </div>
  );
}
