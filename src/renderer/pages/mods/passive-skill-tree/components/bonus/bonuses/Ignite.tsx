import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import { EventListener } from '../fields/event-listener/EventListener';

export const Ignite: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'chance']} label="Chance" />
      <NumberField path={[...path, 'duration']} label="Duration" />
      <EventListener path={[...path, 'event_listener']} />
    </>
  );
};

Ignite.getDefaultConfig = () => {
  return {
    type: 'skilltree:ignite',
    chance: 0.05,
    duration: 5,
    event_listener: EventListener.getDefaultConfig(),
  };
};
