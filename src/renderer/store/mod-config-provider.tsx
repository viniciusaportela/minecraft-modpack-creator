import { memo, PropsWithChildren, useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import { useErrorHandler } from '../core/errors/hooks/useErrorHandler';
import { useAppStore } from './app.store';
import { ProjectModel } from '../core/models/project.model';
import { ModFactory } from '../core/domains/mods/mod-factory';
import { useModConfigStore } from './mod-config.store';
import { ModModel } from '../core/models/mod.model';
import { ModConfigContext } from './mod-config.context';

interface ModConfigProviderProps extends PropsWithChildren {
  mod: ModModel;
}

export const ModConfigProvider = memo(
  ({ children, mod }: ModConfigProviderProps) => {
    const handleError = useErrorHandler();
    const realm = useAppStore((st) => st.realm);
    const [loading, setLoading] = useState(true);
    const [modConfig] = useState(mod.getConfig());

    useEffect(() => {
      setup();
    }, []);

    const setup = async () => {
      try {
        const parsedConfig = modConfig.parseConfig();

        if (!parsedConfig.initialized) {
          const project = realm.objectForPrimaryKey<ProjectModel>(
            ProjectModel.schema.name,
            mod.project,
          )!;
          const modDomain = ModFactory.create(project, mod);
          const initializedConfig =
            await modDomain.initializeConfig(parsedConfig);
          modConfig.writeConfig(initializedConfig);
        }

        const st = useModConfigStore.getState();
        if (!st[mod._id.toString()]) {
          const mostUpdatedConfig = modConfig.parseConfig();

          useModConfigStore.setState({
            [mod._id.toString()]: mostUpdatedConfig,
          });
        }
      } catch (err) {
        await handleError(err);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="mb-20" />
        </div>
      );
    }

    return (
      <ModConfigContext.Provider value={modConfig}>
        {children}
      </ModConfigContext.Provider>
    );
  },
);
