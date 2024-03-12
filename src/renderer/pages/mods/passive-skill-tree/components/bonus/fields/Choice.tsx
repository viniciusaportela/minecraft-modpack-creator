import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Key } from 'react';
import { ChoiceField } from '../../../../../../core/domains/mods/skilltree/bonus/fields/base/choice-field';
import { FieldProps } from '../../../interfaces/bonus-props.interface';

export default function Choice({ field }: FieldProps<ChoiceField<string>>) {
  const [value, setValue] = field.useValue();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button>{field.getLabel(value)}</Button>
      </DropdownTrigger>
      <DropdownMenu
        selectedKeys={[value]}
        onSelectionChange={(keys) =>
          setValue(Array.from((keys as Set<Key>).values())[0])
        }
      >
        {field.getOptions().map((option) => (
          <DropdownItem key={option?.value ?? option}>
            {field.getLabel(option?.value ?? option)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
