import { BrowserWindow } from 'electron';
import { IWindowConfig } from './window-config.interface';

export interface IWindowContext {
  fromRequestId: string;
  window: BrowserWindow;
  config: IWindowConfig;
  respondRequester: ((params: any) => void) | null;
}
