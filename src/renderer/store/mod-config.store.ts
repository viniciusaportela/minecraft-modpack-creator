import { create } from 'zustand';
import cloneDeep from 'lodash.clonedeep';
import { ModConfigModel } from '../core/models/mod-config.model';

export const useModConfigStore = create((zustandSet) => ({
  setConfig: (
    modConfig: ModConfigModel,
    modifierCb: (oldState: any) => any,
    skipRealmWrite = false,
  ) => {
    zustandSet((oldState: any) => {
      const modConfigCopy = cloneDeep(oldState[modConfig.mod.toString()] ?? {});

      const updatedConfig = modifierCb(modConfigCopy);

      if (!skipRealmWrite) {
        modConfig.writeConfig(updatedConfig);
      }

      return { [modConfig.mod.toString()]: updatedConfig };
    });
  },
}));
