import './App.css';
import { useMemo, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { IProjectMeta } from './typings/project-meta.interface';
import { PageContext } from './context/page.context';
import { ProjectContext } from './context/project.context';
import Projects from './pages/projects/Projects';
import AppBar from './components/app-bar/AppBar';
import Project from './pages/project/Project';

export default function App() {
  const [page, setPage] = useState('projects');
  const [project, setProject] = useState<null | IProjectMeta>(null);

  const pageContext = useMemo(() => ({ page, setPage }), [page, setPage]);
  const projectContext = useMemo(
    () => ({ project, setProject }),
    [project, setProject],
  );

  return (
    <main className="dark text-foreground border-[0.5px] bg-zinc-900 border-solid border-zinc-600 flex flex-col">
      <NextUIProvider className="h-[100vh] flex flex-col">
        <PageContext.Provider value={pageContext}>
          <ProjectContext.Provider value={projectContext}>
            <AppBar />
            {page === 'projects' && <Projects />}
            {page === 'project' && <Project />}
          </ProjectContext.Provider>
        </PageContext.Provider>
      </NextUIProvider>
    </main>
  );
}
