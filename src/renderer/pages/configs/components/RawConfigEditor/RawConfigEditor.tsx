import { ConfigNode } from '../../../../core/domains/minecraft/config/ConfigNode';
import SimpleCodeEditor from '../../../../components/simple-code-editor/SimpleCodeEditor';

interface RawConfigEditorProps {
  config: ConfigNode;
  onUpdatedRaw?: (data: string) => void;
  filter?: string;
}

export default function RawConfigEditor({
  config,
  onUpdatedRaw,
  filter,
}: RawConfigEditorProps) {
  const data = config.getRawData();
  const fileType = config.getFileType();

  return (
    <div
      className="flex flex-1 overflow-auto rounded-md"
      style={{ maxHeight: 'calc(100% - 32px)' }}
      id="code-editor"
    >
      <SimpleCodeEditor
        data={data}
        onChange={(value) => config.writeRawData(value, onUpdatedRaw)}
        fileType={fileType === 'snbt' ? 'js' : fileType}
        filter={filter}
      />
    </div>
  );
}
