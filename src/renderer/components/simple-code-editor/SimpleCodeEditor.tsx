import CodeEditor from '@uiw/react-textarea-code-editor';
import rehypePrism from 'rehype-prism-plus';
import rehypeRewrite from 'rehype-rewrite';
import { CSSProperties } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

interface SimpleCodeEditorProps {
  data: string;
  fileType: string;
  onChange?: (data: string) => void;
  readOnly?: boolean;
  filter?: string;
  style?: CSSProperties;
  className?: string;
}

export default function SimpleCodeEditor({
  data,
  fileType,
  onChange,
  readOnly,
  filter,
  className,
  style,
}: SimpleCodeEditorProps) {
  return (
    <AutoSizer>
      {({ width, height }) => (
        <CodeEditor
          value={data}
          className={className}
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
            fontSize: 12,
            overflow: 'auto',
            whiteSpace: 'pre',
            width,
            height,
            ...style,
          }}
        />
      )}
    </AutoSizer>
  );
}
