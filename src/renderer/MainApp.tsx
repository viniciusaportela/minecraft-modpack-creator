import AppBar from './components/app-bar/AppBar';
import Projects from './pages/projects/Projects';
import Project from './pages/project/Project';
import 'reactflow/dist/style.css';
import { Page, Pager } from './components/pager/Pager';
import ProjectPreload from './pages/project-preload/ProjectPreload';
import WaitingForData from './pages/waiting-for-data/WaitingForData';

export default function MainApp() {
  return (
    <>
      <AppBar />
      <Pager initialPage="projects">
        <Page name="projects">
          <Projects />
        </Page>
        <Page name="project-preload">
          <ProjectPreload />
        </Page>
        <Page name="project">
          <Project />
        </Page>
        <Page name="waiting-for-data">
          <WaitingForData />
        </Page>
      </Pager>
    </>
  );
}
