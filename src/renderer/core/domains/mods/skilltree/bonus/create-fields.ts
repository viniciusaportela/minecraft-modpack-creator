import { EBonus } from '../enums/skill-bonus.enum';
import { FieldsField } from './bonuses/fields-field';
import { AllAttributes } from './bonuses/all-attributes';

const classByType: Record<EBonus, typeof FieldsField> = {
  [EBonus.AllAttributes]: AllAttributes,
};

export function createFieldsWithConfig(config: Record<string, any>) {
  const type = config.type as EBonus;
  const Class = classByType[type];

  // @ts-ignore
  return new Class(config);
}

export function createFieldsOfType(type: EBonus) {
  const Class = classByType[type];

  // @ts-ignore
  return new Class();
}
