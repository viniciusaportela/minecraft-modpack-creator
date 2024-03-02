import { ElementType } from 'react';
import ModId from '../typings/mod-id.enum';
import PassiveSkillTree from '../pages/mods/passive-skill-tree/PassiveSkillTree';

export const pageByMod: Record<string, ElementType> = {
  [ModId.PassiveSkillTree]: PassiveSkillTree,
};
