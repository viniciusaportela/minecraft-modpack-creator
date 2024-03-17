import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ComponentChoice } from '../ComponentChoice';
import { EventListenerBlock } from './EventListenerBlock';
import { EventListenerAttack } from './EventListenerAttack';
import { EventListenerDamageTaken } from './EventListenerDamageTaken';
import { EventListenerEvasion } from './EventListenerEvasion';
import { EventListenerItemUsed } from './EventListenerItemUsed';

const OPTIONS: {
  label: string;
  value: string;
  component: FunctionWithDefaultConfig;
}[] = [
  {
    label: 'Block',
    value: 'skilltree:block',
    component: EventListenerBlock,
  },
  {
    label: 'Attack',
    value: 'skilltree:attack',
    component: EventListenerAttack,
  },
  {
    label: 'Damage Taken',
    value: 'skilltree:damage_taken',
    component: EventListenerDamageTaken,
  },
  {
    label: 'Evasion',
    value: 'skilltree:evasion',
    component: EventListenerEvasion,
  },
  {
    label: 'Item Used',
    value: 'skilltree:item_used',
    component: EventListenerItemUsed,
  },
];

export const EventListener: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <ComponentChoice path={path} label={'Event Listener'} options={OPTIONS} />
  );
};

EventListener.getDefaultConfig = () => {
  return EventListenerBlock.getDefaultConfig();
};
