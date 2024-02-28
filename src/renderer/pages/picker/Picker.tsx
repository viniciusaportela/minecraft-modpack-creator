import { Button, Divider, Image, Input } from '@nextui-org/react';
import { Cards, MagnifyingGlass } from '@phosphor-icons/react';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { VanillaItemsBlocks } from './constants/vanilla-items-blocks';
import useParams from '../../hooks/useParams.hook';

export default function Picker() {
  const [inputText, setInputText] = useState('');
  const requestId = useParams('requestId');

  const filteredBlocks = inputText
    ? VanillaItemsBlocks.filter(
        (block) =>
          block.name.toLowerCase().includes(inputText.toLowerCase()) ||
          block.id.toLowerCase().includes(inputText.toLowerCase()),
      )
    : [];

  const select = (block: string) => {
    ipcRenderer.send('windowResponse', requestId, block);
  };

  return (
    <div>
      <div className="border-b-[0.5px] border-b-zinc-700 bg-zinc-800 app-bar-drag px-2 flex items-center">
        <Cards size={16} />
        <span className="ml-2 font-bold">Picker</span>
      </div>
      <div className="p-3">
        <Input
          startContent={<MagnifyingGlass />}
          size="sm"
          value={inputText}
          onValueChange={(text) => setInputText(text)}
          placeholder="Select one block from below or insert it's name or search here"
        />
      </div>
      <Divider />
      <div className="flex flex-col p-2">
        {inputText.trim() === '' &&
          VanillaItemsBlocks.map((block) => (
            <Button
              key={block.name}
              className="justify-start min-h-7 h-7"
              variant="light"
              onPress={() => select(block.id)}
            >
              <Image src={block.image} className="w-5 h-5 mr-1" />
              {block.name}
            </Button>
          ))}
        {inputText.trim() !== '' && (
          <Button
            className="justify-start min-h-7 h-7"
            variant="light"
            onPress={() => select(`minecraft:${inputText}`)}
          >
            minecraft:{inputText}
          </Button>
        )}
        {filteredBlocks.map((block) => (
          <Button
            key={block.name}
            className="justify-start min-h-7 h-7"
            variant="light"
            onPress={() => select(block.id)}
          >
            <Image src={block.image} className="w-5 h-5 mr-1" />
            {block.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
