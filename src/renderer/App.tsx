import './App.css';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';

const MainApp = lazy(() => import('./MainApp'));
const Picker = lazy(() => import('./pages/picker/Picker'));

const Realm = window.require('realm');
const { app } = window.require('electron');

export default function App() {
  const realm = useRef();

  const [loading, setLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');

  useEffect(() => {
    (async () => {
      const dataFolder = app.getPath('userData');

      realm.current = Realm.open({
        schema: [],
        path: `${dataFolder}/minecraft_toolkit.realm`,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="dark text-foreground border-[0.5px] bg-zinc-900 border-solid border-zinc-600 flex flex-col">
      <NextUIProvider className="h-[100vh] flex flex-col">
        <Suspense>
          {page === 'picker' && <Picker />}
          {!page && <MainApp />}
        </Suspense>
      </NextUIProvider>
    </main>
  );
}
