import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';
import { OperationField } from '../OperationField';

export const ItemBonusDurability: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'chance']} label="Chance" />
      <OperationField path={[...path, 'operation']} />
    </>
  );
};

ItemBonusDurability.getDefaultConfig = () => {
  return {
    type: 'skilltree:durability',
    chance: 100,
    operation: OperationField.getDefaultConfig(),
  };
};
