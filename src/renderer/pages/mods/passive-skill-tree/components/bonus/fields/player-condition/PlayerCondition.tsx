import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { ElementType, Key } from 'react';
import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { useModConfig } from '../../../../../../../hooks/use-mod-config';
import PlayerConditionNone from './PlayerConditionNone';
import Label from '../Label';

export interface PlayerConditionChildProps {
  path: string;
}

type PlayerConditionType =
  | 'skilltree:none'
  | 'skilltree:attribute_value'
  | 'skilltree:burning'
  | 'skilltree:dual_wielding'
  | 'skilltree:effect_amount'
  | 'skilltree:fishing'
  | 'skilltree:food_level'
  | 'skilltree:has_effect'
  | 'skilltree:has_gems'
  | 'skilltree:has_item_equipped'
  | 'skilltree:has_item_in_hand'
  | 'skilltree:health_percentage'
  | 'skilltree:underwater';

const OPTIONS: { label: string; value: PlayerConditionType }[] = [
  {
    label: 'None',
    value: 'skilltree:none',
  },
  {
    label: 'Attribute Value',
    value: 'skilltree:attribute_value',
  },
  {
    label: 'Burning',
    value: 'skilltree:burning',
  },
  {
    label: 'Dual Wielding',
    value: 'skilltree:dual_wielding',
  },
  {
    label: 'Effect Amount',
    value: 'skilltree:effect_amount',
  },
  {
    label: 'Fishing',
    value: 'skilltree:fishing',
  },
  {
    label: 'Food Level',
    value: 'skilltree:food_level',
  },
  {
    label: 'Has Effect',
    value: 'skilltree:has_effect',
  },
  {
    label: 'Has Gems',
    value: 'skilltree:has_gems',
  },
  {
    label: 'Has Item Equipped',
    value: 'skilltree:has_item_equipped',
  },
  {
    label: 'Has Item In Hand',
    value: 'skilltree:has_item_in_hand',
  },
  {
    label: 'Health Percentage',
    value: 'skilltree:health_percentage',
  },
  {
    label: 'Underwater',
    value: 'skilltree:underwater',
  },
];

interface PlayerConditionProps {
  path: string[];
}

export const PlayerCondition: FunctionWithDefaultConfig<
  PlayerConditionProps,
  PlayerConditionType
> = ({ path }) => {
  const [value, setValue] = useModConfig(path);

  console.log('PlayerCondition', value);

  const getSelectedLabel = () => {
    const found = OPTIONS.find((option) => option.value === value.type);
    return found ? found.label : '-';
  };

  const getSelectedKeys = () => {
    console.log('getSelectedKeys', [value.type]);
    return [value.type];
  };

  const renderCurrentCondition = () => {
    const componentByOption: Record<PlayerConditionType, ElementType> = {
      'skilltree:none': PlayerConditionNone,
    };

    const Component =
      componentByOption[getSelectedKeys()[0] as keyof typeof componentByOption];

    return <Component path={path} />;
  };

  const onChangeType = (key: Key) => {
    const newDefault = PlayerCondition.getDefaultConfig(
      key as PlayerConditionType,
    );
    setValue(newDefault);
  };

  return (
    <>
      <Label>Player Condition</Label>
      <Dropdown>
        <DropdownTrigger>
          <Button>{getSelectedLabel()}</Button>
        </DropdownTrigger>
        <DropdownMenu onAction={onChangeType} selectedKeys={getSelectedKeys()}>
          {OPTIONS.map((option) => (
            <DropdownItem key={option.value}>{option.label}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {renderCurrentCondition()}
    </>
  );
};

PlayerCondition.getDefaultConfig = (type?: PlayerConditionType) => {
  if (!type) {
    return {
      type: 'skilltree:none',
    };
  }

  const defaultByOption: Record<PlayerConditionType, any> = {
    'skilltree:none': {
      type: 'skilltree:none',
    },
  };

  return defaultByOption[type];
};
