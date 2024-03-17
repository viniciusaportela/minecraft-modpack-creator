import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemCondition } from '../item-condition/ItemCondition';

export const PlayerConditionHealthPercentage: FunctionWithDefaultConfig = ({
  path,
}) => {
  return <ItemCondition path={[...path, 'item_condition']} />;
};

PlayerConditionHealthPercentage.getDefaultConfig = () => {
  return {
    type: 'skilltree:health_percentage',
    min: undefined,
    max: 0.5,
  };
};
