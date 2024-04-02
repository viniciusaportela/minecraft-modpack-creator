import { useAppStore } from '../../store/app.store';
import FilesTree from '../../components/FilesTree/FilesTree';

export default function Configs() {
  const configNodes = useAppStore((st) => st.configs);
  console.log('configNodes', configNodes);

  return (
    <div className="flex h-full">
      <FilesTree nodes={configNodes!} />
      <div className="flex flex-1" />
    </div>
  );
}
