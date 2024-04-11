import { Switch } from '@nextui-org/react';
import { useRefinedConfig } from '../../../../../core/domains/minecraft/config/RefinedConfigContext';
import { curriedReadByPath } from '../../../../../helpers/read-write-by-path';

interface SwitchFieldProps {
  path: string[];
}

export default function SwitchField({ path }: SwitchFieldProps) {
  const config = useRefinedConfig((st) => curriedReadByPath(st.fields)(path));

  return (
    <div className="mt-4 flex flex-col">
      {config.comment && <span>{config.comment}</span>}
      <Switch
        isSelected={config.value === 'true'}
        // onValueChange={(newValue) => write(newValue ? 'true' : 'false')}
      >
        {config.name}
      </Switch>
    </div>
  );
}
