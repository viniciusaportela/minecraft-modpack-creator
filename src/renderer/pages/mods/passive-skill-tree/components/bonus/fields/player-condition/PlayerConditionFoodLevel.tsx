import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';

interface PlayerConditionAttributeValueProps {
  path: string[];
}

// TODO get attribute list with KubeJS
export const PlayerConditionFoodLevel: FunctionWithDefaultConfig<
  PlayerConditionAttributeValueProps
> = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'min']} label="Min" />
      <NumberField path={[...path, 'max']} label="Max" />
    </>
  );
};

PlayerConditionFoodLevel.getDefaultConfig = () => {
  return {
    type: 'skilltree:food_level',
    min: 15,
    max: undefined,
  };
};
