import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useNodes,
} from 'reactflow';
import { useCallback, useEffect, useMemo, useState } from 'react';
import GoBack from '../../../go-back/GoBack';
import { useProjectStore } from '../../../../store/project.store';
import TreeNode from './TreeNode';

export default function EditTree({ setPage }: { setPage: any }) {
  const modpackFolder = useProjectStore((st) => st.modpackFolder);
  const [config, setConfig] = useState(null);

  const [flowNodes, setFlowNodes] = useState([]);
  const [flowEdges, setFlowEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setFlowNodes((nds) => applyNodeChanges(changes, nds)),
    [setFlowNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => setFlowEdges((eds) => applyEdgeChanges(changes, eds)),
    [setFlowEdges],
  );
  const onConnect = useCallback(
    (connection) => setFlowEdges((eds) => addEdge(connection, eds)),
    [setFlowEdges],
  );

  const nodeTypes = useMemo(() => ({ skill_node: TreeNode }), []);

  useEffect(() => {
    getConfig()
      .then((cfg) => {
        configToNodes(cfg);
        configToEdges(cfg);
      })
      .catch(console.error);
  }, []);

  async function getConfig() {
    const cfg = await window.ipcRenderer.invoke(
      'getEditTreeConfig',
      modpackFolder,
    );
    setConfig(cfg);
    return cfg;
  }

  function configToNodes(config: any) {
    const nodes = [];
    config.skills.forEach((cfg) => {
      nodes.push({
        id: cfg.id,
        position: { x: cfg.positionX, y: cfg.positionY },
        data: cfg,
        type: 'skill_node',
      });
    });
    setFlowNodes(nodes);
  }

  function configToEdges(config: any) {
    console.log(config);
    const edges = [];

    config.skills.forEach((cfg, cfgIndex) => {
      cfg.directConnections.map((conn, index) => {
        !cfg.id && console.error(cfg);
        edges.push({
          id: `${cfgIndex}_${index}`,
          source: cfg.id,
          target: conn,
          sourceHandle: 'main',
          targetHandle: 'main',
          type: 'straight',
        });
      });
    });

    setFlowEdges(edges);
  }

  return (
    <div className="w-full h-full flex flex-col">
      <GoBack goBack={() => setPage('dashboard')} title="Edit Tree" />
      <div className="flex-1">
        {config && (
          <ReactFlow
            onNodesChange={onNodesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgesChange}
            nodeDragThreshold={1}
            snapToGrid
            snapGrid={[4, 4]}
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
          />
        )}
      </div>
    </div>
  );
}
