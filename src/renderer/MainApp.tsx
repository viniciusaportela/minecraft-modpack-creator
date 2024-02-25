import { useAppStore } from './store/app.store';
import AppBar from './components/app-bar/AppBar';
import Projects from './pages/projects/Projects';
import Project from './pages/project/Project';
import 'reactflow/dist/style.css';

export default function MainApp() {
  const page = useAppStore((st) => st.page);

  return (
    <>
      <AppBar />
      {page === 'projects' && <Projects />}
      {page === 'project' && <Project />}
    </>
  );
}
