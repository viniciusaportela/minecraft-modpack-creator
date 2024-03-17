import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';
import { TextField } from '../TextField';

export const PlayerMultiplierAttributeValue: FunctionWithDefaultConfig = ({
  path,
}) => {
  return (
    <>
      <TextField path={[...path, 'attribute']} label="Attribute" />
      <NumberField path={[...path, 'divisor']} label="Divisor" />
    </>
  );
};

PlayerMultiplierAttributeValue.getDefaultConfig = () => {
  return {
    type: 'skilltree:attribute_value',
    attribute: 'minecraft:generic.armor',
    divisor: 1,
  };
};
