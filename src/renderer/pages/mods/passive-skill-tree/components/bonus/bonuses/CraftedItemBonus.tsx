import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { ItemCondition } from '../fields/item-condition/ItemCondition';
import { ItemBonus } from '../fields/item-bonus/ItemBonus';

export const CraftedItemBonus: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <ItemCondition path={[...path, 'item_condition']} />
      <ItemBonus path={[...path, 'item_bonus']} />
    </>
  );
};

CraftedItemBonus.getDefaultConfig = () => {
  return {
    type: 'skilltree:crafted_item_bonus',
    item_condition: ItemCondition.getDefaultConfig(),
    item_bonus: ItemBonus.getDefaultConfig(),
  };
};
