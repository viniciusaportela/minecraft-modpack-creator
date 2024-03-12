import { ChoiceField } from './base/choice-field';

export class AttributeField extends ChoiceField<string> {
  getOptions() {
    // TODO all attrb. from realm
    return [];
  }
}
