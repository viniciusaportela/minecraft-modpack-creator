import { ConfigNode } from '../../../core/domains/minecraft/config/ConfigNode';

interface RefinedConfigEditorProps {
  config: ConfigNode;
}

export default function RefinedConfigEditor({
  config,
}: RefinedConfigEditorProps) {
  const data = config.getData();
  console.log(data);

  return null;
}
