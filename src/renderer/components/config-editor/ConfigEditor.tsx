import React, { useEffect, useState } from 'react';

interface IConfiguration {
  type: 'server' | 'client' | 'common';
  path: string;
}

export default function ConfigEditor({
  modId,
  setPage,
}: {
  modId: number;
  setPage: React.Dispatch<
    React.SetStateAction<'dashboard' | 'config-editor' | 'edit-tree'>
  >;
}) {
  const [configurations, setConfigurations] = useState<IConfiguration[]>([]);

  useEffect(() => {
    updateConfigurations().catch(console.error);
  }, []);

  async function updateConfigurations() {
    const config = await window.ipcRenderer.invoke('getConfigurationsFromMod');
  }

  // Look for client / server / common configs
  return (
    <div>
      <h1 className="font-bold text-lg">Edit Configuration</h1>
    </div>
  );
}
