import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';

export const PlayerConditionEffectAmount: FunctionWithDefaultConfig = ({
  path,
}) => {
  return (
    <>
      <NumberField path={[...path, 'min']} label="Min" />
      <NumberField path={[...path, 'max']} label="Max" />
    </>
  );
};

PlayerConditionEffectAmount.getDefaultConfig = () => {
  return {
    type: 'skilltree:effect_amount',
    min: 1,
    max: undefined,
  };
};
