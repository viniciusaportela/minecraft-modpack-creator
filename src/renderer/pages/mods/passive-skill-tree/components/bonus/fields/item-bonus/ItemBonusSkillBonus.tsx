import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { ComponentChoice } from '../ComponentChoice';
import { AllAttributes } from '../../bonuses/AllAttributes';
import {
  COMPONENTS_BY_BONUS,
  EBonus,
  ReadableByBonus,
} from '../../../../../../../core/domains/mods/skilltree/enums/skill-bonus.enum';
import { useModConfigSelector } from '../../../../../../../store/hooks/use-mod-config-selector';

const OPTIONS = () =>
  Object.entries(COMPONENTS_BY_BONUS()).map(([bonus, component]) => ({
    label: ReadableByBonus[bonus as EBonus],
    value: bonus,
    component,
  }));

export const ItemBonusSkillBonus: FunctionWithDefaultConfig = ({ path }) => {
  const [value] = useModConfigSelector(path);

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
    },
  };
};
