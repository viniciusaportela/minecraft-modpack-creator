import rehypePrism from 'rehype-prism-plus';
import CodeEditor from '@uiw/react-textarea-code-editor';
import SimpleCodeEditor from '../../../components/simple-code-editor/SimpleCodeEditor';

interface RawRecipeEditorProps {
  json: string;
  onChange?: (json: string) => void;
  className?: string;
}

export default function RawRecipeEditor({
  json,
  onChange,
  className,
}: RawRecipeEditorProps) {
  return <SimpleCodeEditor data={json} fileType="json" onChange={onChange} />;
}
