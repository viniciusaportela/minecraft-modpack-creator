import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemCondition } from '../item-condition/ItemCondition';

export const PlayerMultiplierGemsAmount: FunctionWithDefaultConfig = ({
  path,
}) => {
  return <ItemCondition path={[...path, 'item_condition']} />;
};

PlayerMultiplierGemsAmount.getDefaultConfig = () => {
  return {
    type: 'skilltree:gems_amount',
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
