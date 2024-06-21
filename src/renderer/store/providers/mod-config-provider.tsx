import { memo, PropsWithChildren, useMemo } from 'react';
import { Spinner } from '@nextui-org/react';
import { useStore } from 'zustand';
import { LazyStoreRegistry } from '../lazy-store-registry';
import { IMod } from '../interfaces/mods-store.interface';
import { ModConfigContext } from '../context/mod-config-context';

interface ModConfigProviderProps extends PropsWithChildren {
  mod?: IMod;
}

export const ModConfigProvider = memo(
  ({ children, mod }: ModConfigProviderProps) => {
    const store = useMemo(
      () => LazyStoreRegistry.getInstance().get(mod),
      [mod],
    );

    const isLoaded = useStore(store, (st) => st.isLoaded);

    if (!isLoaded && !!mod) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="mb-20" />
        </div>
      );
    }

    return (
      <ModConfigContext.Provider value={mod ? store : null}>
        {children}
      </ModConfigContext.Provider>
    );
  },
);
