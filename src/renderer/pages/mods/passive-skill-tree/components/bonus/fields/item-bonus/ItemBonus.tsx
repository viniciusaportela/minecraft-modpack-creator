import { ComponentChoice } from '../ComponentChoice';
import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ItemBonusDurability } from './ItemBonusDurability';
import { ItemBonusFoodEffect } from './ItemBonusFoodEffect';
import { ItemBonusFoodHealing } from './ItemBonusFoodHealing';
import { ItemBonusFoodSaturation } from './ItemBonusFoodSaturation';
import { ItemBonusPotionAmplification } from './ItemBonusPotionAmplification';
import { ItemBonusPotionDuration } from './ItemBonusPotionDuration';
import { ItemBonusSkillBonus } from './ItemBonusSkillBonus';
import { ItemBonusSockets } from './ItemBonusSockets';

const OPTIONS: {
  label: string;
  value: string;
  component: FunctionWithDefaultConfig;
}[] = [
  {
    label: 'Durability',
    value: 'skilltree:durability',
    component: ItemBonusDurability,
  },
  {
    label: 'Food Effect',
    value: 'skilltree:food_effect',
    component: ItemBonusFoodEffect,
  },
  {
    label: 'Food Healing',
    value: 'skilltree:food_healing',
    component: ItemBonusFoodHealing,
  },
  {
    label: 'Food Saturation',
    value: 'skilltree:food_saturation',
    component: ItemBonusFoodSaturation,
  },
  {
    label: 'Potion Amplification',
    value: 'skilltree:potion_amplification',
    component: ItemBonusPotionAmplification,
  },
  {
    label: 'Potion Duration',
    value: 'skilltree:potion_duration',
    component: ItemBonusPotionDuration,
  },
  {
    label: 'Skill Bonus',
    value: 'skilltree:skill_bonus',
    component: ItemBonusSkillBonus,
  },
  {
    label: 'Sockets',
    value: 'skilltree:sockets',
    component: ItemBonusSockets,
  },
];

export const ItemBonus: FunctionWithDefaultConfig = ({ path }) => {
  return <ComponentChoice path={path} label="Item Bonus" options={OPTIONS} />;
};

ItemBonus.getDefaultConfig = () => {
  return ItemBonusDurability.getDefaultConfig();
};
