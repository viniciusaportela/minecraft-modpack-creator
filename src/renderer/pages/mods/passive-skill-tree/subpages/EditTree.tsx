import ReactFlow, {
  Node,
  Edge,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from 'reactflow';
import { useCallback, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import TreeNode from '../components/TreeNode';
import Title from '../../../../components/title/Title';
import SkillEdge from '../components/SkillEdge';
import { usePager } from '../../../../components/pager/hooks/usePager';

const edgeTypes = {
  skill_edge: SkillEdge,
};

const nodeTypes = { skill_node: TreeNode };

export default function EditTree() {
  // const { navigate } = usePager();
  // // const modpackFolder = useProjectStore((st) => st.modpackFolder);
  // const [config, setConfig] = useState(null);
  //
  // const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  // const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  //
  // const onNodesChange = useCallback(
  //   (changes) => setFlowNodes((nds) => applyNodeChanges(changes, nds)),
  //   [setFlowNodes],
  // );
  // const onEdgesChange = useCallback(
  //   (changes) => {
  //     return setFlowEdges((eds) => applyEdgeChanges(changes, eds));
  //   },
  //   [setFlowEdges],
  // );
  // const onConnect = useCallback(
  //   (connection) => {
  //     setFlowEdges((edges) => {
  //       const filtered = flowNodes.filter((n) => n.id === connection.source);
  //       const reduced = filtered.reduce((edgs, node) => {
  //         return addEdge(
  //           {
  //             source: node.id,
  //             target: connection.target,
  //             type: 'skill_edge',
  //             id: `${connection.source}_${connection.target}`,
  //           },
  //           edgs,
  //         );
  //       }, edges);
  //
  //       return reduced;
  //     });
  //   },
  //
  //   [flowNodes, setFlowEdges],
  // );
  //
  // const onEdgeDelete = useCallback(
  //   (edges) => {
  //     setFlowEdges((eds) => {
  //       return eds.filter((e) => !edges.includes(e.id));
  //     });
  //   },
  //   [setFlowEdges],
  // );
  //
  // useEffect(() => {
  //   getConfig()
  //     .then((cfg) => {
  //       configToNodes(cfg);
  //       configToEdges(cfg);
  //     })
  //     .catch(console.error);
  // }, []);
  //
  // async function getConfig() {
  //   const cfg = await ipcRenderer.invoke('getEditTreeConfig', modpackFolder);
  //   setConfig(cfg);
  //   return cfg;
  // }
  //
  // function configToNodes(config: any) {
  //   const nodes = [];
  //   config.skills.forEach((cfg) => {
  //     nodes.push({
  //       id: cfg.id,
  //       position: { x: cfg.positionX, y: cfg.positionY },
  //       data: { ...cfg, modpackFolder },
  //       type: 'skill_node',
  //     });
  //   });
  //   setFlowNodes(nodes);
  // }
  //
  // function configToEdges(config: any) {
  //   const edges = [];
  //
  //   config.skills.forEach((cfg) => {
  //     cfg.directConnections.map((conn) => {
  //       !cfg.id && console.error(cfg);
  //       edges.push({
  //         id: `${cfg.id}_${conn}`,
  //         source: cfg.id,
  //         target: conn,
  //         sourceHandle: 'main',
  //         targetHandle: 'main',
  //         type: 'skill_edge',
  //       });
  //     });
  //   });
  //
  //   setFlowEdges(edges);
  // }
  //
  // return (
  //   <div className="w-full h-full flex flex-col">
  //     <Title goBack={() => navigate('dashboard')}>Edit Tree</Title>
  //     <div className="flex-1">
  //       {config && (
  //         <ReactFlow
  //           onNodesChange={onNodesChange}
  //           onConnect={onConnect}
  //           onEdgeUpdate={onEdgesChange}
  //           nodeDragThreshold={1}
  //           snapToGrid
  //           snapGrid={[4, 4]}
  //           maxZoom={4}
  //           deleteKeyCode="Delete"
  //           onEdgesDelete={onEdgeDelete}
  //           edgeUpdaterRadius={0}
  //           connectionRadius={10}
  //           nodes={flowNodes}
  //           edges={flowEdges}
  //           nodeTypes={nodeTypes}
  //           edgeTypes={edgeTypes}
  //         />
  //       )}
  //     </div>
  //   </div>
  // );
}
