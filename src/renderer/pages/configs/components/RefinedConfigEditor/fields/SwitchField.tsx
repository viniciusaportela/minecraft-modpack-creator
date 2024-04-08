import { Switch } from '@nextui-org/react';
import { RefinedField } from '../../../../../core/domains/minecraft/config/interfaces/parser';

interface SwitchFieldProps {
  field: RefinedField;
}

export default function SwitchField({ field }: SwitchFieldProps) {
  return (
    <div className="mt-4 flex flex-col">
      {field.comment && <span>{field.comment}</span>}
      <Switch isSelected={field.value === 'true'}>{field.name}</Switch>
    </div>
  );
}
