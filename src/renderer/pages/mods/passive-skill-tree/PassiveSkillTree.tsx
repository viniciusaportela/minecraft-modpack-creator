import ConfigEditor from '../../../components/config-editor/ConfigEditor';
import ModId from '../../../typings/mod-id.enum';
import EditTree from './subpages/EditTree';
import { IModPageProps } from '../../../typings/plugin.interface';
import { Page, Pager } from '../../../components/pager/Pager';
import SkillTreeDashboard from './subpages/SkillTreeDashboard';

export default function PassiveSkillTree({ isVisible }: IModPageProps) {
  return (
    <div
      className="p-5 pt-0 w-full flex-1"
      style={{ display: isVisible ? undefined : 'none' }}
    >
      <Pager initialPage="dashboard">
        <Page name="dashboard">
          <SkillTreeDashboard />
        </Page>
        <Page name="edit-tree">
          <EditTree />
        </Page>
        <Page name="config-editor">
          <ConfigEditor modId={ModId.PassiveSkillTree} />
        </Page>
      </Pager>
    </div>
  );
}
