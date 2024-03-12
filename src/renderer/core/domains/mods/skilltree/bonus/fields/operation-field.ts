import { ChoiceField } from './base/choice-field';

export class OperationField extends ChoiceField<0 | 1 | 2> {
  getOptions() {
    return [
      { value: 0, label: 'Add' },
      { value: 1, label: 'Subtract' },
      { value: 2, label: 'Multiply' },
    ];
  }
}
