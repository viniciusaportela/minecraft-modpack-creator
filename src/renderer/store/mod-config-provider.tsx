import { memo, PropsWithChildren, useMemo } from 'react';
import { Spinner } from '@nextui-org/react';
import { ModConfigContext } from './hooks/use-mod-config-selector';
import { ModConfigStore } from './mod-config.store';
import { IMod } from './interfaces/mods-store.interface';

interface ModConfigProviderProps extends PropsWithChildren {
  mod: IMod;
}

export const ModConfigProvider = memo(
  ({ children, mod }: ModConfigProviderProps) => {
    const store = useMemo(() => ModConfigStore.getInstance().get(mod), [mod]);

    if (!store.getState().isLoaded) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="mb-20" />
        </div>
      );
    }

    return (
      <ModConfigContext.Provider value={store}>
        {children}
      </ModConfigContext.Provider>
    );
  },
);
