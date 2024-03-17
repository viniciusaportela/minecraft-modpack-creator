import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';

export const PlayerMultiplierMissingHealthPercentage: FunctionWithDefaultConfig =
  ({ path }) => {
    return <NumberField path={[...path, 'divisor']} label="Divisor" />;
  };

PlayerMultiplierMissingHealthPercentage.getDefaultConfig = () => {
  return {
    type: 'skilltree:missing_health_percentage',
    divisor: 10,
  };
};
