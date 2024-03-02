import { Button, Divider, Input } from '@nextui-org/react';
import { Cards, MagnifyingGlass } from '@phosphor-icons/react';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { FixedSizeList as List } from 'react-window';
import useParams from '../../hooks/useParams.hook';
import { useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { ProjectModel } from '../../core/models/project.model';
import PickerItem from './components/PickerItem';

export default function Picker() {
  const [inputText, setInputText] = useState('');
  const requestId = useParams('requestId');

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!)!;
  const { items } = project;

  const select = (block: string) => {
    ipcRenderer.send('windowResponse', requestId, block);
  };

  const filteredItems = items.filter((item) => {
    if (inputText.trim() === '') return true;
    return item.name.toLowerCase().includes(inputText.toLowerCase());
  });

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
        {inputText.trim() !== '' && (
          <Button
            className="justify-start min-h-7 h-7"
            variant="light"
            onPress={() => select(`minecraft:${inputText}`)}
          >
            minecraft:{inputText}
          </Button>
        )}
        <List
          itemCount={filteredItems.length}
          itemSize={28}
          width={540}
          height={445}
        >
          {({ index, style }) => (
            <PickerItem
              block={filteredItems[index]}
              onPress={() => select(filteredItems[index].id)}
              style={style}
            />
          )}
        </List>
      </div>
    </div>
  );
}
