import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { CaretLeft, CornersOut, Minus, X } from '@phosphor-icons/react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store/app.store';

export default function AppBar() {
  const { goBack, title, customRightElement } = useAppStore(
    useShallow((st) => ({
      goBack: st.goBack,
      title: st.title,
      customRightElement: st.customRightElement,
    })),
  );

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
    <div className="w-full h-unit-10 select-none flex items-center pr-1.5 py-0 bg-zinc-900 border-solid border-b-[0.5px] border-b-zinc-800">
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
      <span className="text-xl font-bold bg-gradient-to-br from-blue-500 to-green-400 bg-clip-text text-transparent ml-5">
        {title}
      </span>
      <div className="flex-1 h-full app-bar-drag" />
      {customRightElement}
      <div className="flex gap-1 ml-2">
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
