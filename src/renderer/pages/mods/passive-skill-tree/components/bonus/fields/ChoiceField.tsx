import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useModConfig } from '../../../../../../hooks/use-mod-config';
import Label from './Label';

interface IFullOption {
  label: string;
  value: string | number;
}

interface ChoiceProps {
  path: string[];
  options: (number | string)[] | IFullOption[];
  label: string;
}

export default function ChoiceField({ options, path, label }: ChoiceProps) {
  const [value, setValue] = useModConfig(path);

  const getLabel = (value: string | number) => {
    if (options.length === 0) {
      return '';
    }

    const found = options.find(
      (option) => option === value || (option as IFullOption)?.value === value,
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
                (
                  options.find(
                    (opt) => opt === key || (opt as IFullOption)?.value === key,
                  ) as IFullOption
                )?.value ?? key
              );
            });
          }}
        >
          {options.map((option) => (
            <DropdownItem key={(option as IFullOption)?.value ?? option}>
              {getLabel((option as IFullOption)?.value ?? option)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
