import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';

export const PlayerMultiplierMissingHealthPoints: FunctionWithDefaultConfig = ({
  path,
}) => {
  return <NumberField path={[...path, 'divisor']} label="Divisor" />;
};

PlayerMultiplierMissingHealthPoints.getDefaultConfig = () => {
  return {
    type: 'skilltree:missing_health_points',
    divisor: 2,
  };
};
