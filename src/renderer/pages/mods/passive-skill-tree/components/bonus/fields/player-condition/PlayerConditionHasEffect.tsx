import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';
import { TextField } from '../TextField';

export const PlayerConditionHasEffect: FunctionWithDefaultConfig = ({
  path,
}) => {
  return (
    <>
      <NumberField path={[...path, 'amplifier']} label="Amplifier" />
      <TextField path={[...path, 'effect']} label="Effect" />
    </>
  );
};

PlayerConditionHasEffect.getDefaultConfig = () => {
  return {
    type: 'skilltree:has_effect',
    amplifier: 1,
    effect: 'poison',
  };
};
