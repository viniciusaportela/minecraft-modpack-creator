import { BrowserWindow } from 'electron';
import windowConfigs from '../core/windowConfigs';

export interface ICreateWindow {
  parent: BrowserWindow;
  page: keyof typeof windowConfigs;
  requestId: string;
  respondRequester: (params: any) => void;
}
