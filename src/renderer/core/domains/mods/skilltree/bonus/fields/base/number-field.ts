import { FieldBase } from './field-base';

export class NumberField extends FieldBase {
  constructor(config: any, params: any) {
    super(config, params);
    this.value = config || 0;
  }

  static withParams = (options: {
    isOptional?: boolean;
    defaultValue: number;
  }) => ({
    classRef: this.constructor,
    options,
  });

  buildConfig() {
    return {
      type: this.getType(),
      value: this.getValue(),
    };
  }

  build() {
    return this.getValue();
  }

  getType(): string {
    return 'number';
  }

  fromConfig(params: any): Record<string, any> {
    return {
      type: this.getType(),
      value: params,
    };
  }
}
