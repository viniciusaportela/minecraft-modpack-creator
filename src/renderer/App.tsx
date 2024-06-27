import './App.css';
import { Suspense, useEffect, useState } from 'react';
import { NextUIProvider, Progress } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import MainApp from './MainApp';
import Picker from './pages/picker/Picker';
import { useAppStore } from './store/app.store';
import { ProjectPreloader } from './core/domains/project/project-preloader';

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const projectIndex = urlParams.get('projectIndex')
    ? parseInt(urlParams.get('projectIndex')!, 10)
    : null;

  const isLoaded = useAppStore((st) => st.isLoaded);
  const [hasLoadedProject, setHasLoadedProject] = useState(false);

  useEffect(() => {
    if (isLoaded && projectIndex !== undefined) {
      const project = useAppStore.getState().projects[projectIndex];
      ProjectPreloader.getInstance()
        .load(project)
        .then(() => {
          return setHasLoadedProject(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isLoaded]);

  if (!isLoaded || (projectIndex && !hasLoadedProject)) {
    return (
      <NextUIProvider className="h-[100vh] flex flex-col w-[100-vw] items-center justify-center">
        <Progress isIndeterminate size="sm" className="p-8" />
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
