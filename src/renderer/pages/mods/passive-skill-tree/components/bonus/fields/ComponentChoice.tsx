import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import get from 'lodash.get';
import set from 'lodash.set';
import { Key } from 'react';
import Label from './Label';
import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { useModConfigStore } from '../../../../../../store/hooks/use-mod-config-store';
import { ISkillTreeConfig } from '../../../../../../core/domains/mods/skilltree/interfaces/skill-tree-config.interface';
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
  const store = useModConfigStore<ISkillTreeConfig>();
  const value = useModConfigSelector((st: ISkillTreeConfig) => get(st, path));

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
    console.log('newDefault for path', path, newDefault);
    store.setState((state) => {
      set(state, path, newDefault);
    });
  };

  const getSelectedKeys = () => {
    console.log('getSelectedKeys', [value.type]);
    return [value.type];
  };

  const renderCurrentComponent = () => {
    const Component = getComponent(getSelectedKeys()[0]);

    return <Component path={path} />;
  };

  const calculateLabelColorFromNestedLevel = () => {
    const baseColorHue = 17;
    const baseColorSaturation = 63;
    const baseColorLightness = 51;

    const BASE_PATH_LENGTH = 7;
    const nestedLevel = path.length - BASE_PATH_LENGTH;

    const hue = baseColorHue + nestedLevel * 25;

    return `hsl(${hue}, ${baseColorSaturation}%, ${baseColorLightness}%)`;
  };

  return (
    <>
      <Label
        className="font-bold"
        style={{ color: calculateLabelColorFromNestedLevel() }}
      >
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
