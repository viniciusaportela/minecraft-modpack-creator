import ReactFlow, {
  Node,
  Edge,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from 'reactflow';
import { useCallback, useEffect, useRef, useState } from 'react';
import path from 'path';
import { readdir, readFile } from 'node:fs/promises';
import clsx from 'clsx';
import TreeNode from '../components/TreeNode';
import Title from '../../../../components/title/Title';
import SkillEdge from '../components/SkillEdge';
import { usePager } from '../../../../components/pager/hooks/usePager';
import { GlobalStateModel } from '../../../../core/models/global-state.model';
import { useQueryById, useQueryFirst } from '../../../../hooks/realm.hook';
import { ProjectModel } from '../../../../core/models/project.model';

const edgeTypes = {
  skill_edge: SkillEdge,
};

const nodeTypes = { skill_node: TreeNode };

export default function EditTree() {
  const { navigate } = usePager();
  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!)!;

  const [config, setConfig] = useState(null);
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);

  const [isPanning, setIsPanning] = useState(false);

  const onNodesChange = useCallback(
    (changes) => setFlowNodes((nds) => applyNodeChanges(changes, nds)),
    [setFlowNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => {
      return setFlowEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setFlowEdges],
  );
  const onConnect = useCallback(
    (connection) => {
      setFlowEdges((edges) => {
        console.log(connection.targetHandle);
        const filtered = flowNodes.filter((n) => n.id === connection.source);
        const reduced = filtered.reduce((edgs, node) => {
          return addEdge(
            {
              source: node.id,
              target: connection.target,
              type: 'skill_edge',
              id: `${connection.source}_${connection.target}`,
              data: { type: connection.targetHandle.replace('-target', '') },
            },
            edgs,
          );
        }, edges);

        return reduced;
      });
    },

    [flowNodes, setFlowEdges],
  );

  const onEdgeDelete = useCallback(
    (edges) => {
      setFlowEdges((eds) => {
        return eds.filter((e) => !edges.includes(e.id));
      });
    },
    [setFlowEdges],
  );

  useEffect(() => {
    const onKeyDown = (ev) => {
      if (ev.key === ' ') {
        setIsPanning(true);
      }
    };

    const onKeyUp = (ev) => {
      if (ev.key === ' ') {
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    getConfig()
      .then((cfg) => {
        configToNodes(cfg);
        configToEdges(cfg);
      })
      .catch(console.error);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  async function getConfig() {
    const basePath = path.join(
      project.path,
      'skilltree',
      'editor',
      'data',
      'skilltree',
    );

    const skillTree = JSON.parse(
      await readFile(
        path.join(basePath, 'skill_trees', 'main_tree.json'),
        'utf8',
      ),
    );

    const skills = [];
    const files = await readdir(path.join(basePath, 'skills'));
    for await (const fileName of files) {
      const file = await readFile(
        path.join(basePath, 'skills', fileName),
        'utf8',
      );
      skills.push(JSON.parse(file));
    }

    setConfig({ skillTree, skills });

    return { skillTree, skills };
  }

  function configToNodes(config: any) {
    const nodes = [];
    config.skills.forEach((cfg) => {
      nodes.push({
        id: cfg.id,
        position: { x: cfg.positionX, y: cfg.positionY },
        data: { ...cfg, modpackFolder: project.path, projectId: project._id },
        type: 'skill_node',
      });
    });
    setFlowNodes(nodes);
  }

  function configToEdges(config: any) {
    const edges = [];

    config.skills.forEach((cfg) => {
      cfg.directConnections.map((conn) => {
        edges.push({
          id: `${cfg.id}_${conn}`,
          source: cfg.id,
          target: conn,
          sourceHandle: 'main-source',
          targetHandle: 'direct-target',
          type: 'skill_edge',
          data: { type: 'direct' },
        });
      });

      console.log('cfg', cfg);
      cfg.oneWayConnections.map((conn) => {
        edges.push({
          id: `one_way_${cfg.id}_${conn}`,
          source: cfg.id,
          target: conn,
          sourceHandle: 'main-source',
          targetHandle: 'one_way-target',
          type: 'skill_edge',
          data: { type: 'one_way' },
        });
      });

      cfg.longConnections.map((conn) => {
        edges.push({
          id: `long_${cfg.id}_${conn}`,
          source: cfg.id,
          target: conn,
          sourceHandle: 'main-source',
          targetHandle: 'long-target',
          type: 'skill_edge',
          data: { type: 'long' },
        });
      });

      // TODO also check for other type of connections
    });

    setFlowEdges(edges);
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Title goBack={() => navigate('dashboard')}>Edit Tree</Title>
      <div className={clsx('flex-1', isPanning && 'is-panning')}>
        {config && (
          <ReactFlow
            onPaneClick={(ev) => console.log(ev)}
            onNodesChange={onNodesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgesChange}
            nodeDragThreshold={1}
            snapToGrid
            snapGrid={[4, 4]}
            maxZoom={4}
            panOnScroll={false}
            panActivationKeyCode={null}
            edgesFocusable={false}
            nodesDraggable={!isPanning}
            deleteKeyCode="Delete"
            onEdgesDelete={onEdgeDelete}
            edgeUpdaterRadius={0}
            connectionRadius={10}
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
          />
        )}
      </div>
    </div>
  );
}
