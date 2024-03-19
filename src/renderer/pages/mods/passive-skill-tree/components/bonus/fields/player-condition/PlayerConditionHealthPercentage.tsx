import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';

export const PlayerConditionHealthPercentage: FunctionWithDefaultConfig = ({
  path,
}) => {
  return (
    <>
      <NumberField path={[...path, 'min']} label="Min" />
      <NumberField path={[...path, 'max']} label="Max" />
    </>
  );
};

PlayerConditionHealthPercentage.getDefaultConfig = () => {
  return {
    type: 'skilltree:health_percentage',
    min: undefined,
    max: 0.5,
  };
};
