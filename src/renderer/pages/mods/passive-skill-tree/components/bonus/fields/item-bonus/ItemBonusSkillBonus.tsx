import { v4 } from 'uuid';
import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ComponentChoice } from '../ComponentChoice';
import { useModConfig } from '../../../../../../../hooks/use-mod-config';
import { AllAttributes } from '../../bonuses/AllAttributes';
import {
  COMPONENTS_BY_BONUS,
  ReadableByBonus,
} from '../../../../../../../core/domains/mods/skilltree/enums/skill-bonus.enum';

const OPTIONS = () =>
  Object.entries(COMPONENTS_BY_BONUS()).map(([bonus, component]) => ({
    label: ReadableByBonus[bonus],
    value: bonus,
    component,
  }));

export const ItemBonusSkillBonus: FunctionWithDefaultConfig = ({ path }) => {
  const [value] = useModConfig(path, { listenMeAndExternalChanges: true });

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
