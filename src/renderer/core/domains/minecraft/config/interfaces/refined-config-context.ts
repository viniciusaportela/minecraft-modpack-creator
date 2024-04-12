import { StoreApi } from 'zustand/vanilla';
import { RefinedField } from './parser';

export interface RefinedConfigContextInterface {
  set: StoreApi<RefinedConfigContextInterface>['setState'];
  fields: RefinedField[];
  write: (path: string[], value: any, callback?: () => void) => void;
}
