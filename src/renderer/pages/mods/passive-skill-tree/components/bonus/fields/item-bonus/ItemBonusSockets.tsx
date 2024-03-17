import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';

export const ItemBonusSockets: FunctionWithDefaultConfig = ({ path }) => {
  return <NumberField path={[...path, 'amount']} label="Amount" />;
};

ItemBonusSockets.getDefaultConfig = () => {
  return {
    type: 'skilltree:sockets',
    amount: 1,
  };
};
