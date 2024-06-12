import { useContext } from 'react';
import { StoreWithModifiers } from '../interfaces/mod-config.interface';
import { ModConfigContext } from '../context/mod-config-context';

export function useModConfigStore<T>(): StoreWithModifiers<T> {
  const storeInContext = useContext(ModConfigContext);

  if (!storeInContext) {
    throw new Error('useModConfigCtx must be used within a ModIdProvider');
  }

  return storeInContext;
}
