import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';

export const QuiverCapacity: FunctionWithDefaultConfig = ({ path }) => {
  return <NumberField path={[...path, 'chance']} label="Quiver Capacity" />;
};

QuiverCapacity.getDefaultConfig = () => {
  return {
    type: 'skilltree:quiver_capacity',
    chance: 100,
  };
};
