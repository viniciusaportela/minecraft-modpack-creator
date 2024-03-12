import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
} from 'reactflow';
import React, {
  Key,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { Connection } from '@reactflow/core/dist/esm/types/general';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import {
  CornersOut,
  DotsThreeVertical,
  NoteBlank,
  Plus,
} from '@phosphor-icons/react';
import set from 'lodash.set';
import TreeNode from '../components/react-flow/TreeNode';
import Title from '../../../../components/title/Title';
import SkillEdge from '../components/react-flow/SkillEdge';
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
import ScreenToFlowPositionGetter from '../components/react-flow/ScreenToFlowPositionGetter';
import FitViewGetter from '../components/react-flow/FitViewGetter';
import { useModConfig } from '../../../../hooks/use-mod-config';

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
  const fitView = useRef();
  const reactFlowRef = useRef<HTMLDivElement>();

  const [{ nodes, edges }, setConfig] = useModConfig((st: any) => ({
    nodes: st.tree.nodes,
    edges: st.tree.edges,
  }));

  const [flowNodes, setFlowNodes] = useState<Node[]>(nodes);
  const [flowEdges, setFlowEdges] = useState<Edge[]>(edges);
  const [focusedNode, setFocusedNode] = useState<Node | null>(null);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    setConfig((oldState: any) => {
      set(oldState, 'tree.nodes', flowNodes);
      set(
        oldState,
        'tree.mainTree.skillIds',
        flowNodes.map((node: Node) => node.id),
      );
      return oldState;
    });
  }, [flowNodes]);

  useEffect(() => {
    setConfig((oldState: any) => {
      set(oldState, 'tree.edges', flowEdges);
      return oldState;
    });
  }, [flowEdges]);

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

  const onNodesChange = useCallback(
    (changes) => {
      if (focusedNode) {
        const hasDeletedFocused = changes.find(
          (c) => c.type === 'remove' && c.id === focusedNode.id,
        );
        if (hasDeletedFocused) {
          setFocusedNode(null);
        }
      }
      setFlowNodes((nds) => applyNodeChanges(changes, nds));
    },
    [focusedNode, setFlowNodes],
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

  const onNodeClick = useCallback((ev: ReactMouseEvent, node: Node) => {
    setFocusedNode(node);
  }, []);

  const addSkill = () => {
    const bounding = reactFlowRef.current.getBoundingClientRect();

    const reactFlowX =
      flowNodes.length > 0 ? bounding.left + bounding.width / 2 - 16 : 0;
    const reactFlowY =
      flowNodes.length > 0 ? bounding.top + bounding.height / 2 - 64 : 0;

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
    if (flowNodes.length === 0) {
      setTimeout(() => {
        fitView.current?.();
      }, 0);
    }
  };

  const startBlank = () => {
    setFlowNodes([]);
    setFlowEdges([]);
  };

  const loadFromEditor = async () => {
    const updatedConfig = await new SkillTree(
      project,
      skillTreeMod,
    ).initializeConfig(skillTreeMod.getConfig());

    setConfig(skillTreeMod, () => {
      return updatedConfig;
    });

    setFlowNodes(updatedConfig.tree.nodes);
    setFlowEdges(updatedConfig.tree.edges);
  };

  const onDropDownAction = (key: Key) => {
    switch (key) {
      case 'start-blank':
        startBlank();
        break;
      case 'reset-tree':
        loadFromEditor();
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex">
        <Title goBack={() => navigate('dashboard')}>Edit Tree</Title>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" isIconOnly className="ml-auto mr-1">
              <DotsThreeVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant="faded" onAction={onDropDownAction}>
            <DropdownItem key="start-blank" startContent={<NoteBlank />}>
              Start blank tree
            </DropdownItem>
            <DropdownItem key="reset-tree" startContent={<NoteBlank />}>
              Reset from editor
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button color="primary" onPress={addSkill}>
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
          fitView
          proOptions={{ hideAttribution: true }}
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          ref={reactFlowRef}
        >
          <ScreenToFlowPositionGetter fnRef={screenToFlowPosition} />
          <FitViewGetter fnRef={fitView} />
        </ReactFlow>
        <EditSkillPanel
          focusedNode={focusedNode}
          setFlowNodes={setFlowNodes}
          onClose={() => setFocusedNode(null)}
        />
        <Button
          className="absolute bottom-2 right-2"
          variant="light"
          isIconOnly
          onPress={() => fitView.current?.()}
        >
          <CornersOut />
        </Button>
      </div>
    </div>
  );
}
