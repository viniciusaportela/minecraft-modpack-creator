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
import { original } from 'immer';
import TreeNode from '../components/react-flow/TreeNode';
import Title from '../../../../components/title/Title';
import SkillEdge from '../components/react-flow/SkillEdge';
import { usePager } from '../../../../components/pager/hooks/usePager';
import ModId from '../../../../typings/mod-id.enum';
import { SkillTree } from '../../../../core/domains/mods/skilltree/skill-tree';
import EditSkillPanel from '../components/edit-skill-panel/EditSkillPanel';
import ScreenToFlowPositionGetter from '../components/react-flow/ScreenToFlowPositionGetter';
import FitViewGetter from '../components/react-flow/FitViewGetter';
import { useSelectedProject } from '../../../../store/app.store';
import { useModById } from '../../../../store/hooks/use-mod-by-id';
import { useModConfigStore } from '../../../../store/hooks/use-mod-config-store';
import { ISkillTreeConfig } from '../../../../core/domains/mods/skilltree/interfaces/skill-tree-config.interface';
import { useModConfigSelector } from '../../../../store/hooks/use-mod-config-selector';

const edgeTypes = {
  skill_edge: SkillEdge,
};

const nodeTypes = { skill_node: TreeNode };

export default function EditTree() {
  const { navigate } = usePager();

  const project = useSelectedProject();
  const skillTreeMod = useModById(ModId.PassiveSkillTree);
  const configStore = useModConfigStore<ISkillTreeConfig>();

  const screenToFlowPosition = useRef();
  const fitView = useRef();
  const reactFlowRef = useRef<HTMLDivElement>();

  const [nodes, setNodes] = useModConfigSelector(['tree', 'nodes']);
  const [edges, setEdges] = useModConfigSelector(['tree', 'edges']);
  const [, setMainTree] = useModConfigSelector(['tree', 'mainTree']);

  const [focusedNode, setFocusedNode] = useState<Node | null>(null);
  const [focusedNodePath, setFocusedNodePath] = useState<string[] | null>(null);

  const reactFlowWrapperClasses = useRef<HTMLDivElement>();

  const onNodesChange = useCallback(
    (changes) => {
      if (changes.find((c) => c.type === 'remove')) {
        rebuildMainTree();

        if (focusedNode) {
          const hasDeletedFocused = changes.find(
            (c) => c.type === 'remove' && c.id === focusedNode.id,
          );
          if (hasDeletedFocused) {
            setFocusedNode(null);
            setFocusedNodePath(null);
          }
        }
      }

      setNodes(applyNodeChanges(changes, configStore.getState().tree.nodes));
    },
    [focusedNode],
  );

  const onEdgesChange = useCallback((changes) => {
    setEdges(applyEdgeChanges(changes, configStore.getState().tree.edges));
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      const mostUpdatedNodes = configStore.getState().tree.nodes;

      const filtered = mostUpdatedNodes.filter(
        (n) => n.id === connection.source,
      );
      const final = filtered.reduce((edgs, node) => {
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
      }, configStore.getState().tree.edges);

      setEdges(final);
    },
    [nodes, edges],
  );

  const onEdgeDelete = useCallback((edgs: Edge[]) => {
    setEdges(
      configStore.getState().tree.edges.filter((e) => !edgs.includes(e.id)),
    );
  }, []);

  const onEdgeClick = useCallback(
    (ev: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      if (ev.altKey) {
        setEdges(
          configStore.getState().tree.edges.filter((e) => e.id !== edge.id),
        );
      }
    },
    [],
  );

  const onNodeClick = useCallback(
    (ev: ReactMouseEvent, node: Node) => {
      setFocusedNode(node);
      const index = configStore
        .getState()
        .tree.nodes.findIndex((n) => n.id === node.id);
      setFocusedNodePath(['tree', 'nodes', String(index)]);
    },
    [nodes],
  );

  const rebuildMainTree = () => {
    setMainTree((mainTree) => {
      mainTree.skillIds = configStore
        .getState()
        .tree.nodes.map((node) => node.id);
      console.log('new maintree', original(mainTree));
      return mainTree;
    });
  };

  const addSkill = () => {
    const bounding = reactFlowRef.current.getBoundingClientRect();

    const mostUpdatedNodes = configStore.getState().tree.nodes;

    const reactFlowX =
      mostUpdatedNodes.length > 0 ? bounding.left + bounding.width / 2 - 16 : 0;
    const reactFlowY =
      mostUpdatedNodes.length > 0 ? bounding.top + bounding.height / 2 - 64 : 0;

    const isAddingTheFirst = mostUpdatedNodes.length === 0;

    console.log('isAddingTHeFirst', isAddingTheFirst);

    const position = isAddingTheFirst
      ? { x: 0, y: 0 }
      : screenToFlowPosition.current({
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
        projectId: project.index.toString(),
        title: 'New skill',
        positionX: position.x,
        positionY: position.y,
        buttonSize: 16,
        isStartingPoint: false,
      },
    };

    setNodes([...configStore.getState().tree.nodes, newNode]);

    rebuildMainTree();
    if (isAddingTheFirst) {
      setTimeout(() => {
        fitView.current?.();
      }, 0);
    }
  };

  const startBlank = () => {
    setFocusedNode(null);
    setFocusedNodePath(null);
    setNodes([]);
    setEdges([]);
    rebuildMainTree();
  };

  const loadFromEditor = async () => {
    const updatedTree = await new SkillTree(
      project,
      skillTreeMod!,
      configStore.getState(),
    ).initializeTree();

    setFocusedNode(null);
    setFocusedNodePath(null);
    setNodes(updatedTree.nodes);
    setEdges(updatedTree.edges);
    rebuildMainTree();
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
