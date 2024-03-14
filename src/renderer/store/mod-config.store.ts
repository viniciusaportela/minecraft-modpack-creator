import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ModConfigModel } from '../core/models/mod-config.model';

export const useModConfigStore = create(
  immer((immerSet) => ({
    setConfig: (
      modConfig: ModConfigModel,
      modifierCb: (oldState: any) => any,
      skipRealmWrite = false,
    ) => {
      let updatedConfig: any;

      immerSet((currentState: any) => {
        updatedConfig = modifierCb(currentState[modConfig.mod.toString()]);

        // if (!skipRealmWrite) {
        //   modConfig.writeConfig(updatedConfig);
        // }

        currentState[modConfig.mod.toString()] = updatedConfig;
      });

      return updatedConfig;
    },
  })),
);
