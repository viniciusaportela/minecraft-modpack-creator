import { Mutate } from 'zustand';
import { StoreApi } from 'zustand/vanilla';

export type IBaseModConfig = {
  isLoaded: boolean;
} & { [key: string]: any };

export type StoreWithModifiers<T> = Mutate<
  StoreApi<T>,
  [['zustand/immer', never]]
>;
