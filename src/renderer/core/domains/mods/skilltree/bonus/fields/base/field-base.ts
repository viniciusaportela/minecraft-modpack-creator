import { useEffect, useState } from 'react';

export abstract class FieldBase {
  protected config: Record<string, any> = {};

  protected changeListeners: ((value: any) => void)[] = [];

  protected value: any;

  static withParams = (params: any) => ({
    classRef: this.constructor,
    params,
  });

  constructor(
    protected readonly initializerConfig?: any,
    protected params?: any,
  ) {}

  useValue() {
    const [value, setValue] = useState(this.getValue());

    useEffect(() => {
      this.addChangeListener(setValue);

      return () => {
        this.removeChangeListener(setValue);
      };
    }, []);

    return [value, this.setValue.bind(this)];
  }

  addChangeListener(onChange: (value: any) => void) {
    this.changeListeners.push(onChange);
  }

  removeChangeListener(onChange: (value: any) => void) {
    this.changeListeners = this.changeListeners.filter(
      (listener) => listener !== onChange,
    );
  }

  protected notifyChangeListeners(value: any) {
    this.changeListeners.forEach((onChange) => onChange(value));
  }

  abstract getType(): string;

  abstract build(): any;

  getValue() {
    return this.value;
  }

  setValue(value: any) {
    this.initializerConfig.value = value;
    this.notifyChangeListeners(value);
  }
}
