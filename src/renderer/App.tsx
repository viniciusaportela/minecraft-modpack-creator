import './App.css';
import {
  lazy,
  LazyExoticComponent,
  Suspense,
  useLayoutEffect,
  useState,
} from 'react';
import { NextUIProvider, Progress } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import Realm from 'realm';
import { Toaster } from 'react-hot-toast';
import { ProjectModel } from './core/models/project.model';
import { TextureModel } from './core/models/texture.model';
import { ItemModel } from './core/models/item.model';
import { BlockModel } from './core/models/block.model';
import { ModModel } from './core/models/mod.model';
import { GlobalStateModel } from './core/models/global-state.model';
import { useAppStore } from './store/app.store';

import { ModConfigModel } from './core/models/mod-config.model';

let MainApp:
  | typeof import('./MainApp')
  | LazyExoticComponent<typeof import('./MainApp').default>;
let Picker:
  | typeof import('./pages/picker/Picker')
  | LazyExoticComponent<typeof import('./pages/picker/Picker').default>;

if (process.env.NODE_ENV === 'development') {
  MainApp = require('./MainApp').default;
  Picker = require('./pages/picker/Picker').default;
} else {
  MainApp = lazy(() => import('./MainApp'));
  Picker = lazy(() => import('./pages/picker/Picker'));
}

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');

  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    (async () => {
      const dataFolder = await ipcRenderer.invoke('getPath', 'userData');
      const realm = await Realm.open({
        schema: [
          ProjectModel,
          TextureModel,
          ItemModel,
          BlockModel,
          ModModel,
          ModConfigModel,
          GlobalStateModel,
        ],
        deleteRealmIfMigrationNeeded: process.env.NODE_ENV === 'development',
        path: `${dataFolder}/minecraft_toolkit.realm`,
      });

      useAppStore.setState({ realm });

      if (!realm.objects(GlobalStateModel)[0]) {
        realm.write(() => {
          realm.create<GlobalStateModel>(GlobalStateModel.schema.name, {});
        });
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <NextUIProvider className="h-[100vh] flex flex-col">
        <Progress isIndeterminate />
      </NextUIProvider>
    );
  }

  return (
    <NextUIProvider className="h-[100vh] flex flex-col">
      <Suspense>
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              backgroundColor: '#27272A',
              color: '#FAFAFA',
            },
          }}
        />
        {page === 'picker' && <Picker />}
        {!page && <MainApp />}
      </Suspense>
    </NextUIProvider>
  );
}
