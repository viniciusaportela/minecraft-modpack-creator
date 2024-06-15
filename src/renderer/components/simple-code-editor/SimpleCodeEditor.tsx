import CodeEditor from '@uiw/react-textarea-code-editor';
import rehypePrism from 'rehype-prism-plus';
import rehypeRewrite from 'rehype-rewrite';

interface SimpleCodeEditorProps {
  data: string;
  fileType: string;
  onChange?: (data: string) => void;
  readOnly?: boolean;
  filter?: string;
}

export default function SimpleCodeEditor({
  data,
  fileType,
  onChange,
  readOnly,
  filter,
}: SimpleCodeEditorProps) {
  return (
    <CodeEditor
      value={data}
      readOnly={readOnly}
      language={fileType === 'snbt' ? 'js' : fileType}
      onChange={(ev) => {
        onChange?.(ev.target.value);
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
  );
}
