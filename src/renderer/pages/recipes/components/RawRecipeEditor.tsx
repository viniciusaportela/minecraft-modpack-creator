import { Button } from '@nextui-org/react';
import SimpleCodeEditor from '../../../components/simple-code-editor/SimpleCodeEditor';

interface RawRecipeEditorProps {
  json: string;
  onChange?: (json: string) => void;
  className?: string;
  onAdded?: (json: string) => void;
  onEdited?: (json: string) => void;
  isEdit?: boolean;
}

export default function RawRecipeEditor({
  json,
  onChange,
  onAdded,
  className,
  onEdited,
  isEdit,
}: RawRecipeEditorProps) {
  return (
    <>
      <div className="flex-1">
        <SimpleCodeEditor
          data={json}
          fileType="json"
          onChange={onChange}
          className={className}
          style={{
            minHeight: 0,
            flex: 1,
          }}
        />
      </div>
      <Button
        color="primary"
        onPress={() => (isEdit ? onEdited?.(json) : onAdded?.(json))}
        className="mt-3"
      >
        {isEdit ? 'Edit' : 'Add'} recipe
      </Button>
    </>
  );
}
