import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Key } from 'react';
import { useModConfigByPath } from '../../../../../../hooks/use-mod-config';

interface ChoiceProps {
  path: string;
  options: (number | string)[] | { label: string; value: string | number }[];
}

export default function ChoiceField({ options, path }: ChoiceProps) {
  const [value, setValue] = useModConfigByPath(path);

  const getLabel = (value: string | number) => {
    if (options.length === 0) {
      return '';
    }

    const found = options.find(
      (option) => option === value || options?.value === value,
    );

    if (typeof found === 'object') {
      return found.label;
    }

    return found;
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button>{getLabel(value)}</Button>
      </DropdownTrigger>
      <DropdownMenu
        selectedKeys={[value]}
        onSelectionChange={(keys) =>
          setValue(Array.from((keys as Set<Key>).values())[0])
        }
      >
        {options.map((option) => (
          <DropdownItem key={option?.value ?? option}>
            {getLabel(option?.value ?? option)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
