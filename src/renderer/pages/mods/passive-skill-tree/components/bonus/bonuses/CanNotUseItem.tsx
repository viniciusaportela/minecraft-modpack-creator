import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { ItemCondition } from '../fields/item-condition/ItemCondition';

export const CanNotUseItem: FunctionWithDefaultConfig = ({ path }) => {
  return <ItemCondition path={[...path, 'item_condition']} />;
};

CanNotUseItem.getDefaultConfig = () => {
  return {
    type: 'skilltree:cant_use_item',
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
