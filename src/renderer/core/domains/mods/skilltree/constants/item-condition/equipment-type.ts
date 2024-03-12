import { choice } from '../fields';

export const ITEM_CONDITION_EQUIPMENT_TYPE = () => ({
  __key: 'skilltree:equipment_type',
  type: 'skilltree:equipment_type',
  equipment_type: choice('helmet', [
    'all',
    'armor',
    'axe',
    'boots',
    'bow',
    'chestplate',
    'crossbow',
    'helment',
    'hoe',
    'leggings',
    'pickaxe',
    'ranged_weapon',
    'shield',
    'shovel',
    'sword',
    'tool',
    'trident',
    'weapon',
  ]),
});
