import { Input } from '@nextui-org/react';
import get from 'lodash.get';
import set from 'lodash.set';
import Label from './Label';
import { useModConfigSelector } from '../../../../../../store/hooks/use-mod-config-selector';
import { ISkillTreeConfig } from '../../../../../../core/domains/mods/skilltree/interfaces/skill-tree-config.interface';
import { useModConfigStore } from '../../../../../../store/hooks/use-mod-config-store';

interface TextFieldProps {
  path: string[];
  label: string;
}

export const TextField = ({ path, label }: TextFieldProps) => {
  const store = useModConfigStore<ISkillTreeConfig>();
  const value = useModConfigSelector((st: ISkillTreeConfig) => get(st, path));

  return (
    <>
      <Label>{label}</Label>
      <Input
        size="sm"
        classNames={{
          inputWrapper: 'px-3 py-1 h-10',
        }}
        value={value}
        onValueChange={(newValue) => {
          store.setState((state) => {
            set(state, path, newValue);
          });
        }}
      />
    </>
  );
};
