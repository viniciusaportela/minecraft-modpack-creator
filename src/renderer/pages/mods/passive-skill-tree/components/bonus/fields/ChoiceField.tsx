import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Key } from 'react';
import { useModConfig } from '../../../../../../hooks/use-mod-config';
import Label from './Label';

interface ChoiceProps {
  path: string[];
  options: (number | string)[] | { label: string; value: string | number }[];
  label: string;
}

export default function ChoiceField({ options, path, label }: ChoiceProps) {
  const [value, setValue] = useModConfig(path);
  console.log('ChoiceField', path, value);

  const getLabel = (value: string | number) => {
    console.log('get label', options, value);
    if (options.length === 0) {
      return '';
    }

    const found = options.find(
      (option) => option === value || option?.value === value,
    );

    if (typeof found === 'object') {
      return found.label;
    }

    return found;
  };

  return (
    <>
      <Label>{label}</Label>
      <Dropdown>
        <DropdownTrigger>
          <Button>{getLabel(value)}</Button>
        </DropdownTrigger>
        <DropdownMenu
          selectedKeys={[value]}
          onAction={(key) => {
            setValue(() => {
              console.log(
                'set value',
                key,
                options.find((opt) => opt == key || opt?.value == key)?.value ??
                  key,
              );
              return (
                options.find((opt) => opt == key || opt?.value == key)?.value ??
                key
              );
            });
          }}
        >
          {options.map((option) => (
            <DropdownItem key={option?.value ?? option}>
              {getLabel(option?.value ?? option)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
