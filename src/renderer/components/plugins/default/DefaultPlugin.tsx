import { useState } from 'react';
import ConfigEditor from '../../config-editor/ConfigEditor';
import { IPluginProps } from '../interfaces/plugin.interface';

export default function DefaultPlugin({ mod }: IPluginProps) {
  const [page, setPage] = useState<'dashboard' | 'config-editor'>('dashboard');

  return (
    <div className="p-5 pt-0">
      <ConfigEditor modId={mod.addonID} setPage={setPage} />
    </div>
  );
}
