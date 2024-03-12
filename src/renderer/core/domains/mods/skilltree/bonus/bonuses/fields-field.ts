import { FieldBase } from '../fields/base/field-base';

export abstract class FieldsField extends FieldBase {
  protected fields: Record<string, FieldBase> = {};

  constructor(config?: Record<string, any>) {
    super(config);

    const schema = this.getSchema();
    Object.entries(schema).forEach(([key, Field]) => {
      if (Field.classRef) {
        // @ts-ignore
        this.fields[key] = new Field.classRef(config?.[key], Field.params);
      } else {
        // @ts-ignore
        this.fields[key] = new Field(config?.[key], {
          notifyRoot: (_: string, value: any) =>
            this.notifyChangeListeners(value),
        });
      }
    });
  }

  abstract getTypeValue(): string;

  abstract getSchema(): Record<
    string,
    typeof FieldBase | { classRef: typeof FieldBase; params: any }
  >;

  abstract getReadableName(): string;

  map<T>(callback: (key: string, field: FieldBase) => T): T[] {
    return Object.entries(this.fields).map(([key, field]) =>
      callback(key, field),
    );
  }

  getType() {
    return 'fields';
  }

  build() {
    return Object.entries(this.fields).reduce(
      (acc, [key, field]) => {
        acc[key] = field.build();
        return acc;
      },
      { type: this.getTypeValue() } as Record<string, any>,
    );
  }
}
