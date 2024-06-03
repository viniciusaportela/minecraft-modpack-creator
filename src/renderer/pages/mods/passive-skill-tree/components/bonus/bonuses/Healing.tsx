import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import { EventListener } from '../fields/event-listener/EventListener';

export const Healing: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'chance']} label="Chance" />
      <NumberField path={[...path, 'amount']} label="Amount" />
      <EventListener path={[...path, 'event_listener']} />
    </>
  );
};

Healing.getDefaultConfig = () => {
  return {
    type: 'skilltree:healing',
    chance: 0.05,
    amount: 5,
    event_listener: EventListener.getDefaultConfig(),
  };
};
