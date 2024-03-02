export interface IWindowConfig {
  page: string;
  type: 'standalone' | 'response';
  closeOnBlur: boolean;
  keepAlive: boolean;
  resizable: boolean;
}
