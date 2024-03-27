import EditTree from './subpages/EditTree';
import { Page, Pager } from '../../../components/pager/Pager';
import SkillTreeDashboard from './subpages/SkillTreeDashboard';

export default function PassiveSkillTree() {
  return (
    <Pager initialPage="dashboard">
      <Page name="dashboard">
        <SkillTreeDashboard />
      </Page>
      <Page name="edit-tree">
        <EditTree />
      </Page>
    </Pager>
  );
}
