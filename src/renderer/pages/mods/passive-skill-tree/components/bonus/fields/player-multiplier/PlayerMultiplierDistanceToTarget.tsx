import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';

export const PlayerMultiplierDistanceToTarget: FunctionWithDefaultConfig =
  () => {
    return null;
  };

PlayerMultiplierDistanceToTarget.getDefaultConfig = () => {
  return {
    type: 'skilltree:distance_to_target',
  };
};
