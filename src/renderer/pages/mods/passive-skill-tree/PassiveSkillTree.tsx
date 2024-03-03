import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import ConfigEditor from '../../../components/config-editor/ConfigEditor';
import ModId from '../../../typings/mod-id.enum';
import EditTree from './subpages/EditTree';
import { IModPageProps } from '../../../typings/plugin.interface';
import { Page, Pager } from '../../../components/pager/Pager';
import Dashboard from './subpages/Dashboard';

export default function PassiveSkillTree({ isVisible }: IModPageProps) {
  // const modpackFolder = useProjectStore((st) => st.modpackFolder);
  //
  // useEffect(() => {
  //   ipcRenderer.invoke(
  //     'loadAllTextures',
  //     'skilltree',
  //     `${modpackFolder}/mods/PassiveSkillTree-1.20.1-BETA-0.6.10a-all.jar`,
  //   );
  // }, []);
  //
  // return (
  //   <div
  //     className="p-5 pt-0 w-full h-full"
  //     style={{ display: isVisible ? undefined : 'none' }}
  //   >
  //     <Pager initialPage="dashboard">
  //       <Page name="dashboard">
  //         <Dashboard />
  //       </Page>
  //       <Page name="edit-tree">
  //         <EditTree />
  //       </Page>
  //       <Page name="config-editor">
  //         <ConfigEditor modId={ModId.PassiveSkillTree} />
  //       </Page>
  //     </Pager>
  //   </div>
  // );
}
