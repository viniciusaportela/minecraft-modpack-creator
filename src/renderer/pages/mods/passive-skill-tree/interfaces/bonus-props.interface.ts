import { FieldBase } from '../../../../core/domains/mods/skilltree/bonus/fields/base/field-base';

export interface FieldProps<T extends FieldBase> {
  field: T;
}
