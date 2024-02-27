import ConfigEditor from '../../../components/config-editor/ConfigEditor';
import { IModPageProps } from '../../../typings/plugin.interface';

export default function DefaultPlugin({ mod, isVisible }: IModPageProps) {
  return (
    <div
      className="p-5 pt-0"
      style={{ display: isVisible ? undefined : 'none' }}
    >
      <ConfigEditor modId={mod.addonID} />
    </div>
  );
}
