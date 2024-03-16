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
import EditSkillPanel from '../components/edit-skill-panel/EditSkillPanel';
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

  const [nodes, setNodes] = useModConfig<Node[]>(['tree', 'nodes'], {
    listenForeignChanges: [
      ['tree', 'nodes', '*', 'data', 'backgroundTexture'],
      ['tree', 'nodes', '*', 'data', 'iconTexture'],
    ],
  });
  const [edges, setEdges] = useModConfig<Edge[]>(['tree', 'edges'], {
    listenMeAndChildrenChanges: true,
  });

  useEffect(() => {
    console.log('nodes changed!');
  }, [nodes]);

  const [focusedNode, setFocusedNode] = useState<Node | null>(null);
  const [focusedNodePath, setFocusedNodePath] = useState<string[] | null>(null);

  const reactFlowWrapperClasses = useRef<HTMLDivElement>();

  const onNodesChange = useCallback(
    (changes) => {
      if (focusedNode) {
        const hasDeletedFocused = changes.find(
          (c) => c.type === 'remove' && c.id === focusedNode.id,
        );
        if (hasDeletedFocused) {
          setFocusedNode(null);
          setFocusedNodePath(null);
        }
      }

      setNodes((currentNodes) => {
        return applyNodeChanges(changes, currentNodes);
      });
    },
    [focusedNode],
  );

  const onEdgesChange = useCallback((changes) => {
    setEdges((curEdges) => {
      return applyEdgeChanges(changes, curEdges);
    });
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((curEdges) => {
        const filtered = curEdges.tree.nodes.filter(
          (n) => n.id === connection.source,
        );
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
    [nodes, edges],
  );

  const onEdgeDelete = useCallback((edgs: Edge[]) => {
    setEdges((curEdges) => {
      return curEdges.filter((e) => !edgs.includes(e.id));
    });
  }, []);

  const onEdgeClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      if (ev.altKey) {
        setEdges((curEdges) => {
          return curEdges.filter((e) => e.id !== edge.id);
        });
      }
    },
    [],
  );

  const onNodeClick = useCallback(
    (ev: ReactMouseEvent, node: Node) => {
      setFocusedNode(node);
      const index = nodes.findIndex((n) => n.id === node.id);
      setFocusedNodePath(['tree', 'nodes', String(index)]);
    },
    [nodes],
  );

  const addSkill = () => {
    const bounding = reactFlowRef.current.getBoundingClientRect();

    const reactFlowX =
      nodes.length > 0 ? bounding.left + bounding.width / 2 - 16 : 0;
    const reactFlowY =
      nodes.length > 0 ? bounding.top + bounding.height / 2 - 64 : 0;

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

    setNodes((curState: any) => {
      return curState.push(newNode);
    });

    const isAddingTheFirst = nodes.length === 0;
    if (isAddingTheFirst) {
      setTimeout(() => {
        fitView.current?.();
      }, 0);
    }
  };

  const startBlank = () => {
    setNodes(() => {
      return [];
    });
    setEdges(() => {
      return [];
    });
  };

  const loadFromEditor = async () => {
    const updatedTree = await new SkillTree(
      project,
      skillTreeMod,
    ).initializeTree();

    setNodes(() => {
      return updatedTree.nodes;
    });
    setEdges(() => {
      return updatedTree.edges;
    });
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
      <div
        id="react-flow-wrapper"
        className={clsx('relative flex-1 mt-2')}
        ref={reactFlowWrapperClasses}
      >
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
          panActivationKeyCode="Space"
          deleteKeyCode="Delete"
          onEdgesDelete={onEdgeDelete}
          edgeUpdaterRadius={0}
          connectionRadius={10}
          fitView
          proOptions={{ hideAttribution: true }}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          ref={reactFlowRef}
        >
          <ScreenToFlowPositionGetter fnRef={screenToFlowPosition} />
          <FitViewGetter fnRef={fitView} />
        </ReactFlow>
        <EditSkillPanel
          key={focusedNodePath?.join('.') ?? null}
          focusedNodePath={focusedNodePath!}
          onClose={() => {
            setFocusedNodePath(null);
            setFocusedNode(null);
          }}
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
