import { Button, Divider, Input } from '@nextui-org/react';
import { Cards, MagnifyingGlass } from '@phosphor-icons/react';
import React, {
  FunctionComponent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { ipcRenderer } from 'electron';
import { FixedSizeList as List } from 'react-window';
import useParams from '../../hooks/useParams.hook';
import { useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { ProjectModel } from '../../core/models/project.model';
import PickerItem from './components/PickerItem';
import { PickerType } from '../../typings/picker-type.enum';
import { useAppStore } from '../../store/app.store';
import { ItemModel } from '../../core/models/item.model';
import { TextureModel } from '../../core/models/texture.model';
import { BlockModel } from '../../core/models/block.model';

interface PickerListItemProps {
  item: ItemModel | BlockModel | TextureModel;
  style: React.CSSProperties;
  select: (item: ItemModel | BlockModel | TextureModel) => void;
  type: PickerType;
}

export function PickerListItem({
  item,
  style,
  select,
  type,
}: PickerListItemProps) {
  return (
    <PickerItem
      item={item}
      onPress={() => select(item)}
      style={style}
      type={type}
    />
  );
}

function reflectOnRef(ref: React.MutableRefObject<any>) {
  return (prev: any, newValue: any) => {
    if (typeof prev === 'function') {
      const calculatedValue = newValue(prev);
      ref.current = calculatedValue;
      return calculatedValue;
    }

    ref.current = newValue;
    return newValue;
  };
}

export default function Picker() {
  const inputTextRef = useRef('');
  const [inputText, setInputText] = useReducer(reflectOnRef(inputTextRef), '');

  const requestId = useParams('requestId');

  const [type, setType] = useState(PickerType.Item);

  const realm = useAppStore((st) => st.realm);
  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!)!;

  const [listItems, setListItems] = useState<
    {
      render: FunctionComponent<{
        index: number;
        style: React.CSSProperties;
        data: any;
      }>;
      type: string;
      showOnSearch?: boolean;
      alwaysShow?: boolean;
      value: string | null;
    }[]
  >([]);

  useEffect(() => {
    ipcRenderer.on('init', (ev, type) => {
      setType(type as PickerType);
    });

    return () => {
      ipcRenderer.removeAllListeners('init');
    };
  }, []);

  const calculateItemIdFromSearch = () => {
    const hasId = inputTextRef.current.includes(':');
    if (hasId) {
      return inputTextRef.current;
    }
    return `minecraft:${inputTextRef.current}`;
  };

  useEffect(() => {
    if (
      [
        PickerType.SkillTreeBackground,
        PickerType.SkillTreeBackground,
        PickerType.SkillTreeIcon,
        PickerType.Texture,
      ].includes(type)
    ) {
      const textures = realm
        .objects<TextureModel>(TextureModel.schema.name)
        .filtered('project = $0', project._id);

      setListItems([
        {
          render: ({ style }) => (
            <Button
              className="justify-start min-h-7 h-7 w-full"
              variant="light"
              style={style}
              onPress={() => select(calculateItemIdFromSearch())}
            >
              {calculateItemIdFromSearch()}
            </Button>
          ),
          type: 'search',
          showOnSearch: true,
          value: null,
        },
        ...textures.map((texture) => ({
          render: ({ style }) => (
            <PickerListItem
              style={style}
              type={type}
              item={texture}
              select={(item) => select((item as TextureModel).textureId)}
            />
          ),
          type: 'item',
          value: texture.textureId,
        })),
      ]);
    } else if (type === PickerType.Item) {
      const items = realm
        .objects<ItemModel>(ItemModel.schema.name)
        .filtered('project = $0', project._id);

      setListItems([
        {
          render: ({ style }) => (
            <Button
              className="justify-start min-h-7 h-7 w-full"
              variant="light"
              style={style}
              onPress={() => select(`@custom:removeItem`)}
            >
              Remove item
            </Button>
          ),
          type: 'remove',
          alwaysShow: true,
          value: null,
        },
        {
          render: ({ style }) => (
            <Button
              className="justify-start min-h-7 h-7 w-full"
              variant="light"
              style={style}
              onPress={() => select(calculateItemIdFromSearch())}
            >
              {calculateItemIdFromSearch()}
            </Button>
          ),
          type: 'search',
          showOnSearch: true,
          value: null,
        },
        ...items.map((item) => ({
          render: ({ style }) => (
            <PickerListItem
              style={style}
              item={item}
              type={type}
              select={(item) => select((item as ItemModel).itemId)}
            />
          ),
          type: 'item',
          value: item.name,
        })),
      ]);
    }
  }, [type]);

  const select = (block: string) => {
    ipcRenderer.send('windowResponse', requestId, block);
  };

  const filteredItems = listItems.filter((item) => {
    if (inputText.trim() === '') {
      return !item.showOnSearch;
    }

    return (
      (item.value &&
        item.value.toLowerCase().includes(inputText.toLowerCase())) ||
      item.showOnSearch ||
      item.alwaysShow
    );
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
        <List
          itemCount={filteredItems.length}
          itemSize={28}
          width={540}
          height={445}
        >
          {({ style, index, data }) =>
            filteredItems[index].render({ style, index, data: data?.itemData })
          }
        </List>
      </div>
    </div>
  );
}
