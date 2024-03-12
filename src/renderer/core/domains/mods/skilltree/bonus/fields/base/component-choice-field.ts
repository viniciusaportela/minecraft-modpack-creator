import { ChoiceField } from './choice-field';

export abstract class ComponentChoiceField<
  TChoices extends string | number,
> extends ChoiceField<TChoices> {
  getType() {
    return 'component-choice';
  }

  getOption(key: string) {
    return this.getOptions().find((option) => option.key === key);
  }
}
