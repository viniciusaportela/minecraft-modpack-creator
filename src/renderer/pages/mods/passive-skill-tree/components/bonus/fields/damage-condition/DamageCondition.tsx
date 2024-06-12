import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ComponentChoice } from '../ComponentChoice';
import DamageConditionNone from './DamageConditionNone';
import DamageConditionProjectile from './DamageConditionProjectile';
import DamageConditionMelee from './DamageConditionMelee';

const OPTIONS = [
  {
    label: 'Melee',
    value: 'skilltree:melee',
    component: DamageConditionMelee,
  },
  {
    label: 'Projectile',
    value: 'skilltree:projectile',
    component: DamageConditionProjectile,
  },
  {
    label: 'None',
    value: 'skilltree:none',
    component: DamageConditionNone,
  },
];

export const DamageCondition: FunctionWithDefaultConfig<{
  path: string[];
  label?: string;
}> = ({ path, label }) => {
  return (
    <ComponentChoice
      label={label ?? 'Damage Condition'}
      path={path}
      options={OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
        component: option.component,
      }))}
    />
  );
};

DamageCondition.getDefaultConfig = () => {
  return DamageConditionNone.getDefaultConfig();
};
