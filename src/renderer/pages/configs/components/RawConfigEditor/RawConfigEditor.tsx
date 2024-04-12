import CodeEditor from '@uiw/react-textarea-code-editor';
import { ConfigNode } from '../../../../core/domains/minecraft/config/ConfigNode';

interface RawConfigEditorProps {
  config: ConfigNode;
  onUpdatedRaw?: (data: string) => void;
}

export default function RawConfigEditor({
  config,
  onUpdatedRaw,
}: RawConfigEditorProps) {
  const data = config.getRawData();
  const fileType = config.getFileType();

  return (
    <div
      className="flex flex-1 overflow-auto rounded-md"
      style={{ maxHeight: 'calc(100% - 32px)' }}
      id="code-editor"
    >
      <CodeEditor
        value={data}
        language={fileType === 'snbt' ? 'js' : fileType}
        onChange={(ev) => {
          config.writeRawData(ev.target.value, onUpdatedRaw);
        }}
        style={{
          fontFamily: 'IBM Plex Mono',
          height: 'fit-content',
          fontSize: 12,
          minHeight: '100%',
          minWidth: '100%',
        }}
      />
    </div>
  );
}
