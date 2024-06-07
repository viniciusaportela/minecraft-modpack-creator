import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { StoreApi } from 'zustand/vanilla';

export const ModConfigContext = createContext<any>(null!);

export function useModConfigStore<T extends (state: any) => any>(
  selector: T,
): ReturnType<T> {
  const storeInContext = useContext(ModConfigContext);

  if (!storeInContext) {
    throw new Error('useModConfigCtx must be used within a ModIdProvider');
  }

  return useStore(
    storeInContext as StoreApi<T>,
    selector as (state: unknown) => R,
  );
}
