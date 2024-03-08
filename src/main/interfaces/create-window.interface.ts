import { BrowserWindow } from 'electron';
import windowConfigs from '../core/window-configs';

export interface ICreateWindow {
  parent: BrowserWindow;
  page: keyof typeof windowConfigs;
  requestId: string;
  respondRequester: (params: any) => void;
  params: any[];
}
