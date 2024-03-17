import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemCondition } from '../item-condition/ItemCondition';

export const PlayerConditionHasItemEquipped: FunctionWithDefaultConfig = ({
  path,
}) => {
  return <ItemCondition path={[...path, 'item_condition']} />;
};

PlayerConditionHasItemEquipped.getDefaultConfig = () => {
  return {
    type: 'skilltree:has_item_equipped',
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
