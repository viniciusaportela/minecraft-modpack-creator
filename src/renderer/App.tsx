import './App.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { NextUIProvider, Progress } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import Realm from 'realm';
import { RealmContext } from './store/realm.context';
import { ProjectModel } from './core/models/project.model';
import { TextureModel } from './core/models/texture.model';
import { ItemModel } from './core/models/item.model';
import { BlockModel } from './core/models/block.model';
import { ModModel } from './core/models/mod.model';
import { GlobalStateModel } from './core/models/global-state.model';
import ProjectsServiceClass from './core/services/projects/projects-service-class';
import { useAppStore } from './store/app.store';

const MainApp = lazy(() => import('./MainApp'));
const Picker = lazy(() => import('./pages/picker/Picker'));

// eslint-disable-next-line import/no-mutable-exports
export let ProjectsService: ProjectsServiceClass =
  null as unknown as ProjectsServiceClass;

export default function App() {
  const [loading, setLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const [realm, setRealm] = useState<Realm | null>(null);

  useEffect(() => {
    (async () => {
      const dataFolder = await ipcRenderer.invoke('getPath', 'userData');
      const r = await Realm.open({
        schema: [
          ProjectModel,
          TextureModel,
          ItemModel,
          BlockModel,
          ModModel,
          GlobalStateModel,
        ],
        deleteRealmIfMigrationNeeded: true,
        path: `${dataFolder}/minecraft_toolkit.realm`,
      });
      setRealm(r);

      ProjectsService = new ProjectsServiceClass(r);

      if (!r.objects(GlobalStateModel)[0]) {
        r.write(() => {
          const globalState = r.create<GlobalStateModel>(
            GlobalStateModel.schema.name,
            {},
          );
          useAppStore.setState({ globalState });
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
      {loading ? (
        <Progress isIndeterminate />
      ) : (
        <RealmContext.Provider value={realm}>
          <Suspense>
            {page === 'picker' && <Picker />}
            {!page && <MainApp />}
          </Suspense>
        </RealmContext.Provider>
      )}
    </NextUIProvider>
  );
}
