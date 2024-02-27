import AppBar from './components/app-bar/AppBar';
import Projects from './pages/projects/Projects';
import Project from './pages/project/Project';
import 'reactflow/dist/style.css';
import { Page, Pager } from './components/pager/Pager';

export default function MainApp() {
  return (
    <>
      <AppBar />
      <Pager initialPage="projects">
        <Page name="projects">
          <Projects />
        </Page>
        <Page name="project">
          <Project />
        </Page>
      </Pager>
    </>
  );
}
