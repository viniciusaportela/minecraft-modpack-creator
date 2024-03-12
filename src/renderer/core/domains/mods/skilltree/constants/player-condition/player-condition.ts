import { componentChoice, subcomponent } from '../fields';
import { PLAYER_CONDITION_NONE } from './condition-none';
import { PLAYER_CONDITION_ATTRIBUTE_VALUE } from './attribute-value';
import { PLAYER_CONDITION_BURNING } from './burning';
import { PLAYER_CONDITION_DUAL_WIELDING } from './dual-wielding';
import { PLAYER_CONDITION_EFFECT_AMOUNT } from './effect-amount';
import { ITEM_CONDITION_FISHING } from './fishing';
import { ITEM_CONDITION_FOOD_LEVEL } from './food_level';
import { PLAYER_CONDITION_HAS_EFFECT } from './has-effect';

export const PLAYER_CONDITION = () =>
  componentChoice('skilltree:none', [
    PLAYER_CONDITION_NONE(),
    PLAYER_CONDITION_ATTRIBUTE_VALUE(),
    PLAYER_CONDITION_BURNING(),
    PLAYER_CONDITION_DUAL_WIELDING(),
    PLAYER_CONDITION_EFFECT_AMOUNT(),
    ITEM_CONDITION_FISHING(),
    ITEM_CONDITION_FOOD_LEVEL(),
    PLAYER_CONDITION_HAS_EFFECT(),
  ]);

export const playerCondition = () => {
  return subcomponent(PLAYER_CONDITION);
};
