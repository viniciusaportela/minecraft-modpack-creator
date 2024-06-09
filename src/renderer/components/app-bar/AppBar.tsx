import React, { useState } from 'react';
import { Button, Chip } from '@nextui-org/react';
import { CaretLeft, CornersOut, Minus, X } from '@phosphor-icons/react';
import { ipcRenderer } from 'electron';
import { useAppStore } from '../../store/app.store';

export default function AppBar() {
  const { goBack, title, headerMiddleComponent } = useAppStore((st) => ({
    goBack: st.goBack,
    title: st.title,
    headerMiddleComponent: st.headerMiddleComponent,
  }));

  const [isMaximize, setMaximize] = useState(false);

  const close = () => {
    ipcRenderer.invoke('close');
  };

  const maximize = () => {
    setMaximize(!isMaximize);
    ipcRenderer.invoke('maximize');
  };

  const minimize = () => {
    ipcRenderer.invoke('minimize');
  };

  return (
    <div className="w-full h-[40px] min-h-[40px] select-none flex items-center pr-1.5 py-0 bg-zinc-900 border-solid border-b-[0.5px] border-b-zinc-800">
      {goBack && (
        <Button
          variant="light"
          onPress={goBack}
          size="sm"
          className="p-2 min-w-5 ml-3 -mr-3"
        >
          <CaretLeft size={20} />
        </Button>
      )}
      <span className="text-xl font-bold bg-gradient-to-br from-blue-500 to-green-400 bg-clip-text text-transparent ml-5 min-w-fit">
        {title}
      </span>
      <Chip size="sm" className="text-xs ml-2">
        ALPHA
      </Chip>
      {headerMiddleComponent || <div className="flex-1 app-bar-drag h-full" />}
      <div className="flex gap-1 ml-2">
        <Button
          isIconOnly
          aria-label="Like"
          size="sm"
          onClick={minimize}
          variant="flat"
          className="bg-zinc-800"
        >
          <Minus className="text-zinc-200" />
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
          <CornersOut className="text-zinc-200" />
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
          <X className="text-zinc-200" />
        </Button>
      </div>
    </div>
  );
}
