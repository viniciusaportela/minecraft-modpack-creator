import './App.css';
import { lazy, Suspense } from 'react';
import { NextUIProvider } from '@nextui-org/react';

const MainApp = lazy(() => import('./MainApp'));
const Picker = lazy(() => import('./pages/picker/Picker'));

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const childPage = urlParams.get('childPage');

  return (
    <main className="dark text-foreground border-[0.5px] bg-zinc-900 border-solid border-zinc-600 flex flex-col">
      <NextUIProvider className="h-[100vh] flex flex-col">
        <Suspense>
          {childPage === 'picker' && <Picker />}
          {!childPage && <MainApp />}
        </Suspense>
      </NextUIProvider>
    </main>
  );
}
