import { IpcRenderer } from '../main/preload';

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

export {};
