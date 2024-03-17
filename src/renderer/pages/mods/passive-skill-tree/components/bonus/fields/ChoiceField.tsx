import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useModConfig } from '../../../../../../hooks/use-mod-config';
import Label from './Label';

interface ChoiceProps {
  path: string[];
  options: (number | string)[] | { label: string; value: string | number }[];
  label: string;
}

export default function ChoiceField({ options, path, label }: ChoiceProps) {
  const [value, setValue] = useModConfig(path);

  const getLabel = (value: string | number) => {
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
              return (
                // eslint-disable-next-line eqeqeq
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
