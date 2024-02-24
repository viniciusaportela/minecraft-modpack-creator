import {
  contextBridge,
  ipcRenderer as electronIpcRenderer,
  IpcRendererEvent,
} from 'electron';

export type Channels = 'ipc-example';

const ipcRenderer = {
  sendMessage(channel: Channels, ...args: unknown[]) {
    electronIpcRenderer.send(channel, ...args);
  },
  on(channel: Channels, func: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      func(...args);
    electronIpcRenderer.on(channel, subscription);

    return () => {
      electronIpcRenderer.removeListener(channel, subscription);
    };
  },
  once(channel: Channels, func: (...args: unknown[]) => void) {
    electronIpcRenderer.once(channel, (_event, ...args) => func(...args));
  },
  invoke(channel: string, ...args: unknown[]) {
    return electronIpcRenderer.invoke(channel, ...args);
  },
};

contextBridge.exposeInMainWorld('ipcRenderer', electronIpcRenderer);

export type IpcRenderer = typeof ipcRenderer;
