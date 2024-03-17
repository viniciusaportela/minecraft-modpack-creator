import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemCondition } from './ItemCondition';

export const ItemConditionEnchanted: FunctionWithDefaultConfig = ({ path }) => {
  return <ItemCondition path={[...path, 'item_condition']} />;
};

ItemConditionEnchanted.getDefaultConfig = () => {
  return {
    type: 'skilltree:enchanted',
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
