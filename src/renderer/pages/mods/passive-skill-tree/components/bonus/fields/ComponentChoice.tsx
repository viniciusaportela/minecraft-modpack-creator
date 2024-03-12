import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Key } from 'react';
import { FieldProps } from '../../../interfaces/bonus-props.interface';
import { ComponentChoiceField } from '../../../../../../core/domains/mods/skilltree/bonus/fields/base/component-choice-field';
import FieldsRenderer from '../FieldsRenderer';

export default function ComponentChoice({
  field,
}: FieldProps<ComponentChoiceField<string>>) {
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
          <DropdownItem key={option?.key ?? option}>
            {field.getLabel(option?.key ?? option)}
          </DropdownItem>
        ))}
      </DropdownMenu>
      <FieldsRenderer fields={field.getOption(value)} />
    </Dropdown>
  );
}
