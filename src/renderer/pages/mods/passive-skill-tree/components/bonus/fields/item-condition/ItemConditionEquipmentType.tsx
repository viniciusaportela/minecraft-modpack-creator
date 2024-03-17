import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import ChoiceField from '../ChoiceField';

const OPTIONS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Armor',
    value: 'armor',
  },
  {
    label: 'Axe',
    value: 'axe',
  },
  {
    label: 'Boots',
    value: 'boots',
  },
  {
    label: 'Bow',
    value: 'bow',
  },
  {
    label: 'Chestplate',
    value: 'chestplate',
  },
  {
    label: 'Crossbow',
    value: 'crossbow',
  },
  {
    label: 'Helmet',
    value: 'helmet',
  },
  {
    label: 'Hoe',
    value: 'hoe',
  },
  {
    label: 'Leggings',
    value: 'leggings',
  },
  {
    label: 'Melee Weapon',
    value: 'melee_weapon',
  },
  {
    label: 'Pickaxe',
    value: 'pickaxe',
  },
  {
    label: 'Ranged Weapon',
    value: 'ranged_weapon',
  },
  {
    label: 'Shield',
    value: 'shield',
  },
  {
    label: 'Shovel',
    value: 'shovel',
  },
  {
    label: 'Sword',
    value: 'sword',
  },
  {
    label: 'Tool',
    value: 'tool',
  },
  {
    label: 'Trident',
    value: 'trident',
  },
  {
    label: 'Weapon',
    value: 'weapon',
  },
];

export const ItemConditionEquipmentType: FunctionWithDefaultConfig = ({
  path,
}) => {
  return (
    <ChoiceField
      path={[...path, 'equipment_type']}
      options={OPTIONS}
      label="Equipment Type"
    />
  );
};

ItemConditionEquipmentType.getDefaultConfig = () => {
  return {
    type: 'skilltree:equipment_type',
    equipment_type: 'shovel',
  };
};
