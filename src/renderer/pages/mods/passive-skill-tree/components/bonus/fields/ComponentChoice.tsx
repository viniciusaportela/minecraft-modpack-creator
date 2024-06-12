import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Key } from 'react';
import Label from './Label';
import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { useModConfigSelector } from '../../../../../../store/hooks/use-mod-config-selector';

interface ComponentChoiceProps {
  path: string[];
  label: string;
  options: {
    label: string;
    value: string;
    component: FunctionWithDefaultConfig;
  }[];
}

export const ComponentChoice = ({
  path,
  label,
  options,
}: ComponentChoiceProps) => {
  const [value, setValue] = useModConfigSelector(path);

  const getSelectedLabel = () => {
    const found = options.find((option) => option.value === value.type);
    return found ? found.label : '-';
  };

  const getComponent = (key: Key) => {
    return options.find((option) => option.value === key)?.component!;
  };

  const onChangeType = (key: Key) => {
    const Component = getComponent(key);
    const newDefault = Component.getDefaultConfig();
    setValue(newDefault);
  };

  const getSelectedKeys = () => {
    return [value.type];
  };

  const renderCurrentComponent = () => {
    const Component = getComponent(getSelectedKeys()[0]);

    return <Component path={path} />;
  };

  return (
    <>
      <Label className="font-bold" nestLevel={path.length} path={path}>
        {label}
      </Label>
      <Dropdown>
        <DropdownTrigger>
          <Button>{getSelectedLabel()}</Button>
        </DropdownTrigger>
        <DropdownMenu onAction={onChangeType} selectedKeys={getSelectedKeys()}>
          {options.map((option) => (
            <DropdownItem key={option.value}>{option.label}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {renderCurrentComponent()}
    </>
  );
};
