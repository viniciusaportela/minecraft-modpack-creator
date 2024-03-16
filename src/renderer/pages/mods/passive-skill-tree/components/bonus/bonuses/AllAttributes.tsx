import NumberField from '../fields/NumberField';
import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { BonusProps } from '../../../interfaces/bonus-props.interface';
import { OperationField } from '../fields/OperationField';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';

export const AllAttributes: FunctionWithDefaultConfig<BonusProps> = ({
  bonusPath,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <NumberField path={[...bonusPath, 'amount']} label="Amount" />
      <OperationField path={[...bonusPath, 'operation']} />
      <PlayerCondition path={[...bonusPath, 'player_condition']} />
    </div>
  );
};

AllAttributes.getDefaultConfig = () => {
  return {
    type: 'skilltree:all_attributes',
    amount: 1,
    operation: OperationField.getDefaultConfig(),
    player_condition: PlayerCondition.getDefaultConfig('skilltree:none'),
  };
};
