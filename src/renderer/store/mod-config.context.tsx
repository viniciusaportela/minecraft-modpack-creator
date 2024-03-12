import { createContext, useContext } from 'react';
import { ModConfigModel } from '../core/models/mod-config.model';

export const ModConfigContext = createContext<ModConfigModel>(null!);

export function useModConfigCtx() {
  const context = useContext(ModConfigContext);

  if (!context) {
    throw new Error('useModConfigCtx must be used within a ModIdProvider');
  }

  return context;
}
