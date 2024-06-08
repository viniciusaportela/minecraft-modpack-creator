import { createContext, useContext } from 'react';
import { StoreWithModifiers } from '../interfaces/mod-config.interface';

export const ModConfigContext = createContext<any>(null!);

export function useModConfigStore<T>(): StoreWithModifiers<T> {
  const storeInContext = useContext(ModConfigContext);

  if (!storeInContext) {
    throw new Error('useModConfigCtx must be used within a ModIdProvider');
  }

  return storeInContext;
}
