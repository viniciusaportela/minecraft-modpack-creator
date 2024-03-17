import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';
import { TextField } from '../TextField';

export const ItemBonusFoodEffect: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <TextField path={[...path, 'effect']} label="Effect" />
      <NumberField path={[...path, 'duration']} label="Duration" />
      <NumberField path={[...path, 'amplifier']} label="Amplifier" />
    </>
  );
};

ItemBonusFoodEffect.getDefaultConfig = () => {
  return {
    type: 'skilltree:food_effect',
    effect: 'minecraft:regeneration',
    duration: 600,
    amplifier: 0,
  };
};
