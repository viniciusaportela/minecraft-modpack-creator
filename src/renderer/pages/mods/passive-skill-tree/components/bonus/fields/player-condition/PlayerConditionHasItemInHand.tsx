import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemCondition } from '../item-condition/ItemCondition';

export const PlayerConditionHasItemInHand: FunctionWithDefaultConfig = ({
  path,
}) => {
  return <ItemCondition path={[...path, 'item_condition']} />;
};

PlayerConditionHasItemInHand.getDefaultConfig = () => {
  return {
    type: 'skilltree:has_item_in_hand',
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
