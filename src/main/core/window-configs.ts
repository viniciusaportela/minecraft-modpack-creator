import { IWindowConfig } from '../interfaces/window-config.interface';

const windowConfigs: Record<string, IWindowConfig> = {
  picker: {
    page: 'picker',
    type: 'response',
    closeOnBlur: true,
    keepAlive: true,
  },
};

export default windowConfigs;
