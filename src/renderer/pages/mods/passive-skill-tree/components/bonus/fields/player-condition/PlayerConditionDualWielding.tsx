import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemCondition } from '../item-condition/ItemCondition';

interface PlayerConditionDualWieldingProps {
  path: string[];
}

export const PlayerConditionDualWielding: FunctionWithDefaultConfig<
  PlayerConditionDualWieldingProps
> = ({ path }) => {
  return <ItemCondition path={[...path, 'item_condition']} />;
};

PlayerConditionDualWielding.getDefaultConfig = () => {
  return {
    type: 'skilltree:dual_wielding',
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
