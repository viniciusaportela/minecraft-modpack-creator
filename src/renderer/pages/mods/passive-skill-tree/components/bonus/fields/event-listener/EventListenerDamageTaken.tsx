import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { PlayerCondition } from '../player-condition/PlayerCondition';
import { PlayerMultiplier } from '../player-multiplier/PlayerMultiplier';
import ChoiceField from '../ChoiceField';

const TARGET_OPTIONS = [
  {
    label: 'Player',
    value: 'player',
  },
  {
    label: 'Enemy',
    value: 'enemy',
  },
];

const DAMAGE_OPTIONS = [
  {
    label: 'Melee',
    value: 'skilltree:melee',
  },
  {
    label: 'Projectile',
    value: 'skilltree:projectile',
  },
  {
    label: 'None',
    value: 'skilltree:none',
  },
];

export const EventListenerDamageTaken: FunctionWithDefaultConfig = ({
  path,
}) => {
  return (
    <>
      <ChoiceField
        path={[...path, 'target']}
        options={TARGET_OPTIONS}
        label="Target"
      />
      <ChoiceField
        path={[...path, 'damage_condition']}
        options={DAMAGE_OPTIONS}
        label="Damage Condition"
      />
      <PlayerCondition path={[...path, 'player_condition']} />
      <PlayerMultiplier path={[...path, 'player_multiplier']} />
      <PlayerCondition
        path={[...path, 'enemy_condition']}
        label="Enemy Condition"
      />
      <PlayerMultiplier
        path={[...path, 'enemy_multiplier']}
        label="Enemy Multiplier"
      />
    </>
  );
};

EventListenerDamageTaken.getDefaultConfig = () => {
  return {
    type: 'skilltree:damage_taken',
    damage_condition: 'skilltree:melee',
    target: 'enemy',
    player_condition: PlayerCondition.getDefaultConfig(),
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
    enemy_condition: PlayerCondition.getDefaultConfig(),
    enemy_multiplier: PlayerMultiplier.getDefaultConfig(),
  };
};
