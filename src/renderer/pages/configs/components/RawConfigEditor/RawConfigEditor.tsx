import CodeEditor from '@uiw/react-textarea-code-editor';
import rehypePrism from 'rehype-prism-plus';
import rehypeRewrite from 'rehype-rewrite';
import { ConfigNode } from '../../../../core/domains/minecraft/config/ConfigNode';

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
      <CodeEditor
        value={data}
        language={fileType === 'snbt' ? 'js' : fileType}
        onChange={(ev) => {
          config.writeRawData(ev.target.value, onUpdatedRaw);
        }}
        rehypePlugins={[
          [rehypePrism, { ignoreMissing: true }],
          [
            rehypeRewrite,
            {
              rewrite: (node, index, parent) => {
                if (
                  filter &&
                  node.type === 'text' &&
                  node.value.includes(filter) &&
                  parent.children.length === 1
                ) {
                  parent.properties.className.push('highlight-filter');
                }
              },
            },
          ],
        ]}
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
