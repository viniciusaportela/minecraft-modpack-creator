import { v4 } from 'uuid';
import get from 'lodash.get';
import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ComponentChoice } from '../ComponentChoice';
import { AllAttributes } from '../../bonuses/AllAttributes';
import {
  COMPONENTS_BY_BONUS,
  EBonus,
  ReadableByBonus,
} from '../../../../../../../core/domains/mods/skilltree/enums/skill-bonus.enum';
import { ISkillTreeConfig } from '../../../../../../../core/domains/mods/skilltree/interfaces/skill-tree-config.interface';
import { useModConfigSelector } from '../../../../../../../store/hooks/use-mod-config-selector';

const OPTIONS = () =>
  Object.entries(COMPONENTS_BY_BONUS()).map(([bonus, component]) => ({
    label: ReadableByBonus[bonus as EBonus],
    value: bonus,
    component,
  }));

export const ItemBonusSkillBonus: FunctionWithDefaultConfig = ({ path }) => {
  const value = useModConfigSelector((st: ISkillTreeConfig) => get(st, path));

  const getLabel = (type: string) => {
    return OPTIONS().find((option) => option.value === type)?.label ?? '';
  };

  return (
    <ComponentChoice
      path={[...path, 'skill_bonus']}
      label={getLabel(value?.type)}
      options={OPTIONS()}
    />
  );
};

ItemBonusSkillBonus.getDefaultConfig = () => {
  return {
    type: 'skilltree:skill_bonus',
    skill_bonus: {
      ...AllAttributes.getDefaultConfig(),
      name: 'Skill',
      id: v4(),
    },
  };
};
