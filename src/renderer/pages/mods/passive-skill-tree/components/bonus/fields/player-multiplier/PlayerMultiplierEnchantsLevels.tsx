import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemCondition } from '../item-condition/ItemCondition';

export const PlayerMultiplierEnchantsLevels: FunctionWithDefaultConfig = ({
  path,
}) => {
  return <ItemCondition path={[...path, 'item_condition']} />;
};

PlayerMultiplierEnchantsLevels.getDefaultConfig = () => {
  return {
    type: 'skilltree:enchants_levels',
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
