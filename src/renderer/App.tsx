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

const MainApp = lazy(() => import('./MainApp'));
const Picker = lazy(() => import('./pages/picker/Picker'));

export default function App() {
  const [loading, setLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const [realm, setRealm] = useState<Realm | null>(null);

  useEffect(() => {
    (async () => {
      const exists = fs.existsSync('/home/vinicius');
      console.log('exists', exists);
      const dataFolder = await ipcRenderer.invoke('getPath', 'userData');
      const r = await Realm.open({
        schema: [ProjectModel, TextureModel, ItemModel, BlockModel, ModModel],
        path: `${dataFolder}/minecraft_toolkit.realm`,
      });
      setRealm(r);
      const tasks = r.objects(ProjectModel);
      console.log('tasks', tasks);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="dark text-foreground border-[0.5px] bg-zinc-900 border-solid border-zinc-600 flex flex-col">
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
    </main>
  );
}
