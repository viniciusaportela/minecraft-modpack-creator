import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

interface IConfiguration {
  type: 'server' | 'client' | 'common';
  path: string;
}

export default function ConfigEditor({ modId }: { modId: string }) {
  const [configurations, setConfigurations] = useState<IConfiguration[]>([]);

  useEffect(() => {
    updateConfigurations().catch(console.error);
  }, []);

  async function updateConfigurations() {
    const config = await ipcRenderer.invoke('getConfigurationsFromMod');
  }

  // Look for client / server / common configs
  return (
    <div>
      <h1 className="font-bold text-lg">Edit Configuration</h1>
    </div>
  );
}
