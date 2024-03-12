import { FieldBase } from './field-base';

export class ChoiceField<TValues extends string | number> extends FieldBase {
  constructor(
    config: any,
    params: { options: { key?: string; label: string; value: TValues }[] },
  ) {
    super(config, params);

    this.value = config ?? this.getOptions()[0]?.value ?? this.getOptions()[0];
  }

  static withOptions = (options: { isOptional?: boolean }) => ({
    classRef: this.constructor,
    options,
  });

  buildConfig() {
    return {
      type: this.getType(),
      value: this.getValue(),
      values: this.getOptions(),
    };
  }

  getLabel(key: string) {
    return (
      this.getOptions().find((option) => option.value === key)?.label ?? key
    );
  }

  getOptions() {
    return this.params.options;
  }

  getType(): string {
    return 'choice';
  }

  build(): any {
    return this.getValue();
  }
}
