import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  useReactFlow,
} from 'reactflow';
import React, {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { Connection } from '@reactflow/core/dist/esm/types/general';
import { Button } from '@nextui-org/react';
import { Plus } from '@phosphor-icons/react';
import TreeNode from '../components/TreeNode';
import Title from '../../../../components/title/Title';
import SkillEdge from '../components/SkillEdge';
import { usePager } from '../../../../components/pager/hooks/usePager';
import { GlobalStateModel } from '../../../../core/models/global-state.model';
import {
  useQuery,
  useQueryById,
  useQueryFirst,
} from '../../../../hooks/realm.hook';
import { ModModel } from '../../../../core/models/mod.model';
import ModId from '../../../../typings/mod-id.enum';
import { SkillTree } from '../../../../core/domains/mods/skilltree/skill-tree';
import { ProjectModel } from '../../../../core/models/project.model';
import EditSkillPanel from '../components/EditSkillPanel';
import ScreenToFlowPositionGetter from '../components/ScreenToFlowPositionGetter';

const edgeTypes = {
  skill_edge: SkillEdge,
};

const nodeTypes = { skill_node: TreeNode };

export default function EditTree() {
  const { navigate } = usePager();
  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!)!;
  const skillTreeMod = useQuery(ModModel, (obj) =>
    obj.filtered(
      'modId = $0 AND project = $1',
      ModId.PassiveSkillTree,
      globalState.selectedProjectId!,
    ),
  )[0];

  const screenToFlowPosition = useRef();
  const reactFlowRef = useRef();

  const config = skillTreeMod.getConfig();

  const [flowNodes, setFlowNodes] = useState<Node[]>(config.tree.nodes);
  const [flowEdges, setFlowEdges] = useState<Edge[]>(config.tree.edges);
  const [focusedNode, setFocusedNode] = useState<Node | null>(null);

  useEffect(() => {
    config.tree.nodes = flowNodes;
    skillTreeMod.writeConfig(config);
    new SkillTree(project, skillTreeMod).updateMainTree(skillTreeMod);
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

  console.log(flowNodes);

  const onNodeClick = useCallback((ev: ReactMouseEvent, node: Node) => {
    setFocusedNode(node);
  }, []);

  const addSkill = () => {
    const reactFlowX =
      reactFlowRef.current.offsetLeft + reactFlowRef.current.offsetWidth / 2;
    const reactFlowY =
      reactFlowRef.current.offsetTop + reactFlowRef.current.offsetHeight / 2;

    const position = screenToFlowPosition.current({
      x: reactFlowX,
      y: reactFlowY,
    });

    const id = `skilltree:skill_node_${Date.now()}`;

    const newNode = {
      id,
      type: 'skill_node',
      position,
      data: {
        id,
        bonuses: [],
        label: 'New Skill',
        directConnections: [],
        longConnections: [],
        oneWayConnections: [],
        backgroundTexture: 'skilltree:textures/icons/background/lesser.png',
        iconTexture: 'skilltree:textures/icons/void.png',
        borderTexture: 'skilltree:textures/tooltip/lesser.png',
        modpackFolder: project.path,
        projectId: project._id.toString(),
        title: 'New skill',
        positionX: reactFlowX,
        positionY: reactFlowY,
        buttonSize: 16,
        isStartingPoint: false,
      },
    };

    setFlowNodes((nds) => [...nds, newNode]);
  };

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
      <div className="flex">
        <Title goBack={() => navigate('dashboard')}>Edit Tree</Title>
        <Button color="primary" className="ml-auto" onPress={addSkill}>
          <Plus />
          Add Skill
        </Button>
      </div>
      <div className={clsx('relative flex-1 mt-2', isPanning && 'is-panning')}>
        <ReactFlow
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          onEdgeUpdate={onEdgesChange}
          nodeDragThreshold={1}
          snapToGrid
          onNodeClick={onNodeClick}
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
          ref={reactFlowRef}
        >
          <ScreenToFlowPositionGetter fnRef={screenToFlowPosition} />
        </ReactFlow>
        <EditSkillPanel
          focusedNode={focusedNode}
          setFlowNodes={setFlowNodes}
          onClose={() => setFocusedNode(null)}
        />
      </div>
    </div>
  );
}
