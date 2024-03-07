import ReactFlow, {
  Node,
  Edge,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from 'reactflow';
import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Connection } from '@reactflow/core/dist/esm/types/general';
import TreeNode from '../components/TreeNode';
import Title from '../../../../components/title/Title';
import SkillEdge from '../components/SkillEdge';
import { usePager } from '../../../../components/pager/hooks/usePager';
import { GlobalStateModel } from '../../../../core/models/global-state.model';
import { useQuery, useQueryFirst } from '../../../../hooks/realm.hook';
import { ModModel } from '../../../../core/models/mod.model';
import ModId from '../../../../typings/mod-id.enum';
import { SkillTree } from '../../../../core/domains/mods/skilltree/skill-tree';

const edgeTypes = {
  skill_edge: SkillEdge,
};

const nodeTypes = { skill_node: TreeNode };

export default function EditTree() {
  const { navigate } = usePager();
  const globalState = useQueryFirst(GlobalStateModel);

  const skillTreeMod = useQuery(ModModel, (obj) =>
    obj.filtered(
      'modId = $0 AND project = $1',
      ModId.PassiveSkillTree,
      globalState.selectedProjectId!,
    ),
  )[0];

  const config = skillTreeMod.getConfig();

  const [flowNodes, setFlowNodes] = useState<Node[]>(config.tree.nodes);
  const [flowEdges, setFlowEdges] = useState<Edge[]>(config.tree.edges);

  useEffect(() => {
    config.tree.nodes = flowNodes;
    skillTreeMod.writeConfig(config);
    SkillTree.updateMainTree(skillTreeMod);
  }, [flowNodes]);

  useEffect(() => {
    config.tree.edges = flowEdges;
    skillTreeMod.writeConfig(config);
  }, [flowEdges]);

  const [isPanning, setIsPanning] = useState(false);

  const onNodesChange = useCallback(
    (changes) => {
      setFlowNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setFlowNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => {
      return setFlowEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setFlowEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setFlowEdges((edges) => {
        console.log(connection.targetHandle);
        const filtered = flowNodes.filter((n) => n.id === connection.source);
        return filtered.reduce((edgs, node) => {
          return addEdge(
            {
              source: node.id,
              target: connection.target as string,
              type: 'skill_edge',
              id: `${connection.source}_${connection.target}`,
              data: { type: connection.targetHandle!.replace('-target', '') },
            },
            edgs,
          );
        }, edges);
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

  const onEdgeClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      if (ev.altKey) {
        setFlowEdges((eds) => {
          return eds.filter((e) => edge.id !== e.id);
        });
      }
    },
    [],
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

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <Title goBack={() => navigate('dashboard')}>Edit Tree</Title>
      <div className={clsx('flex-1 mt-2', isPanning && 'is-panning')}>
        <ReactFlow
          onPaneClick={(ev) => console.log(ev)}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          onEdgeUpdate={onEdgesChange}
          nodeDragThreshold={1}
          snapToGrid
          snapGrid={[4, 4]}
          maxZoom={4}
          panOnScroll={false}
          panActivationKeyCode={null}
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
      </div>
    </div>
  );
}
