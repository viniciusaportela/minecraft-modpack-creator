import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { BonusProps } from '../../../interfaces/bonus-props.interface';
import { ItemCondition } from '../fields/item-condition/ItemCondition';
import { ItemBonus } from '../fields/item-bonus/ItemBonus';

export const EnchantmentItemRequirement: FunctionWithDefaultConfig<
  BonusProps
> = ({ bonusPath }) => {
  return (
    <>
      <ItemCondition path={[...bonusPath, 'chance']} />
      <ItemBonus path={[...bonusPath, 'item_bonus']} />
    </>
  );
};

EnchantmentItemRequirement.getDefaultConfig = () => {
  return {
    type: 'skilltree:created_item_bonus',
    item_condition: ItemCondition.getDefaultConfig(),
    item_bonus: ItemBonus.getDefaultConfig(),
  };
};
