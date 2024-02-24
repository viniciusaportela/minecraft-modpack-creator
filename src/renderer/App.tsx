import './App.css';
import { useMemo, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { IProjectMeta } from './typings/project-meta.interface';
import { PageContext } from './context/page.context';
import { ProjectContext } from './context/project.context';
import Projects from './pages/projects/projects';
import AppBar from './components/app-bar/app-bar';
import Project from './pages/project/project';

export default function App() {
  const [page, setPage] = useState('projects');
  const [project, setProject] = useState<null | IProjectMeta>(null);

  const pageContext = useMemo(() => ({ page, setPage }), [page, setPage]);
  const projectContext = useMemo(
    () => ({ project, setProject }),
    [project, setProject],
  );

  return (
    <main className="dark text-foreground bg-background">
      <NextUIProvider>
        <PageContext.Provider value={pageContext}>
          <ProjectContext.Provider value={projectContext}>
            <div className="w-[100vw] h-[100vh] flex flex-col border-[0.5px] border-solid border-zinc-700 bg-zinc-900">
              <AppBar />
              {page === 'projects' && <Projects />}
              {page === 'project' && <Project />}
            </div>
          </ProjectContext.Provider>
        </PageContext.Provider>
      </NextUIProvider>
    </main>
  );
}
