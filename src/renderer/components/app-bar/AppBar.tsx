import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { CornersOut, Minus, X } from '@phosphor-icons/react';

export default function AppBar() {
  const [isMaximize, setMaximize] = useState(false);

  const close = () => {
    window.ipcRenderer.invoke('close');
  };

  const maximize = () => {
    setMaximize(!isMaximize);
    window.ipcRenderer.invoke('maximize');
  };

  const minimize = () => {
    window.ipcRenderer.invoke('minimize');
  };

  return (
    <div className="w-full h-unit-10 select-none flex items-center px-2 py-0 bg-zinc-900 border-solid border-b-[0.5px] border-b-zinc-800">
      <span className="text-xl font-bold bg-gradient-to-br from-blue-500 to-green-400 bg-clip-text text-transparent">
        My Projects
      </span>
      <div className="flex-1 h-full app-bar-drag" />
      <div className="flex gap-1">
        <Button
          isIconOnly
          aria-label="Like"
          size="sm"
          onClick={minimize}
          variant="flat"
          className="bg-zinc-800"
        >
          <Minus />
        </Button>
        <Button
          isIconOnly
          color="default"
          aria-label="Like"
          size="sm"
          onClick={maximize}
          variant="flat"
          className="bg-zinc-800"
        >
          <CornersOut />
        </Button>
        <Button
          isIconOnly
          color="default"
          aria-label="Like"
          size="sm"
          onClick={close}
          variant="flat"
          className="bg-zinc-800"
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
