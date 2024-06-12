import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import get from 'lodash.get';
import Label from './Label';
import { useModConfigStore } from '../../../../../../store/hooks/use-mod-config-store';
import { ISkillTreeConfig } from '../../../../../../core/domains/mods/skilltree/interfaces/skill-tree-config.interface';
import { useModConfigSelector } from '../../../../../../store/hooks/use-mod-config-selector';

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
  const store = useModConfigStore<ISkillTreeConfig>();
  const [value, setValue] = useModConfigSelector(path);

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
            store.setState((state) => {
              get(state, path) === key;
            });

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
