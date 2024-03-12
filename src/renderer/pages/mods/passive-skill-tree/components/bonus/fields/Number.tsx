import { Input } from '@nextui-org/react';
import { FieldProps } from '../../../interfaces/bonus-props.interface';
import { NumberField } from '../../../../../../core/domains/mods/skilltree/bonus/fields/base/number-field';

export default function Number({ field }: FieldProps<NumberField>) {
  const [value, setValue] = field.useValue();

  return <Input value={value} onValueChange={setValue} />;
}
