import { choice } from '../fields';

export const ITEM_CONDITION_POTION = () => ({
  __key: 'skilltree:potion',
  type: 'skilltree:potion',
  potion_type: choice('any', ['any', 'neutral', 'beneficial', 'harmful']),
});
