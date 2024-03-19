import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { TextField } from '../fields/TextField';

export const Command: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <TextField path={[...path, 'command']} label="Command" />
      <TextField path={[...path, 'remove_command']} label="Remove Command" />
    </>
  );
};

Command.getDefaultConfig = () => {
  return {
    type: 'skilltree:command',
    command: '',
    remove_command: '',
  };
};
