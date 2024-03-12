import { PickerType } from '../../../../../typings/picker-type.enum';

export function choice(
  defaultValue: string | number,
  choices: { key: string | number; value: string | number }[] | string[],
) {
  return {
    type: 'choice',
    value: defaultValue,
    values: choices,
  };
}

export function componentChoice(
  defaultValue: string,
  choices: { __key: string; [key: string]: any }[],
) {
  return {
    type: 'advanced_choice',
    value: defaultValue,
    values: choices,
  };
}

export function number(defaultValue: number) {
  return {
    type: 'number',
    value: defaultValue,
  };
}

export function itemPicker() {
  return {
    type: 'picker',
    pickerType: PickerType.Item,
  };
}

export function tagPicker() {
  return {
    type: 'picker',
    pickerType: PickerType.Tag,
  };
}
export function subcomponent(subConfigFn: () => any) {
  return {
    type: 'subcomponent',
    value: subConfigFn().value,
    subcomponentConfig: subConfigFn,
  };
}

export function withTransformer(
  config: Record<string, any>,
  transformer: (v: any) => any,
) {
  return {
    ...config,
    transformer,
  };
}

export function removeMinusOne(config: Record<string, any>) {
  return withTransformer(config, (v: number) => (v === -1 ? undefined : v));
}
