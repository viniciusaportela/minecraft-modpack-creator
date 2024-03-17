import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemCondition } from '../item-condition/ItemCondition';

export const PlayerMultiplierEnchantsAmount: FunctionWithDefaultConfig = ({
  path,
}) => {
  return <ItemCondition path={[...path, 'item_condition']} />;
};

PlayerMultiplierEnchantsAmount.getDefaultConfig = () => {
  return {
    type: 'skilltree:enchants_amount',
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
