import { ipcRenderer } from 'electron';
import path from 'path';
import { storeWithPersist } from './helpers/store-with-persist';
import { IAppStore } from './interfaces/app-store.interface';

export const appStore = storeWithPersist<IAppStore>({
  pathGetter: async () => {
    const userDataPath = await ipcRenderer.invoke('getPath', 'userData');
    return path.join(userDataPath, 'app.json');
  },
  initialState: {
    isLoading: true,
    projects: [],
    title: 'My Projects',
    goBack: null,
    configs: null,
    selectedProjectIndex: -1,
    selectedProject: null,
    headerMiddleComponent: null,
    userDataPath: '',
  },
  partialize: (state) => {
    return {
      projects: state.projects,
      selectedProjectIndex: state.selectedProjectIndex,
    };
  },
});
