import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';
import { OperationField } from '../OperationField';

export const ItemBonusPotionDuration: FunctionWithDefaultConfig = ({
  path,
}) => {
  return (
    <>
      <NumberField path={[...path, 'multiplier']} label="Multiplier" />;
      <OperationField path={[...path, 'operation']} />;
    </>
  );
};

ItemBonusPotionDuration.getDefaultConfig = () => {
  return {
    type: 'skilltree:potion_duration',
    multiplier: 0.1,
    operation: OperationField.getDefaultConfig(),
  };
};
