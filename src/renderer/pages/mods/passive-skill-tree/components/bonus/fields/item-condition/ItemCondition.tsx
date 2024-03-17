import { ComponentChoice } from '../ComponentChoice';
import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemConditionEquipmentType } from './ItemConditionEquipmentType';
import { ItemConditionNone } from './ItemConditionNone';
import { ItemConditionEnchanted } from './ItemConditionEnchanted';
import { ItemConditionFood } from './ItemConditionFood';
import { ItemConditionItemId } from './ItemConditionItemId';
import { ItemConditionPotion } from './ItemConditionPotion';
import { ItemConditionTag } from './ItemConditionTag';

const OPTIONS: {
  label: string;
  value: string;
  component: FunctionWithDefaultConfig;
}[] = [
  {
    label: 'None',
    value: 'skilltree:none',
    component: ItemConditionNone,
  },
  {
    label: 'Equipment Type',
    value: 'skilltree:equipment_type',
    component: ItemConditionEquipmentType,
  },
  {
    label: 'Enchanted',
    value: 'skilltree:enchanted',
    component: ItemConditionEnchanted,
  },
  {
    label: 'Food',
    value: 'skilltree:food',
    component: ItemConditionFood,
  },
  {
    label: 'Item ID',
    value: 'skilltree:item_id',
    component: ItemConditionItemId,
  },
  {
    label: 'Potion',
    value: 'skilltree:potion',
    component: ItemConditionPotion,
  },
  {
    label: 'Tag',
    value: 'skilltree:tag',
    component: ItemConditionTag,
  },
];

export const ItemCondition: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <ComponentChoice path={path} label="Item Condition" options={OPTIONS} />
  );
};

ItemCondition.getDefaultConfig = () => {
  return ItemConditionEquipmentType.getDefaultConfig();
};
