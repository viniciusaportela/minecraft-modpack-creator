import path from 'path';
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { Edge, Node } from 'reactflow';
import { DefaultMod } from '../default-mod';
import { ISkillTreeConfig } from './interfaces/skill-tree-config.interface';

export class SkillTree extends DefaultMod {
  async build() {
    // TODO check if has KubeJS installed, if so, use their path for datapacks
    const config = this.modConfig;

    const basePath = path.join(
      this.project.path,
      'minecraft-toolkit',
      'generated',
      'skilltree',
    );

    await mkdir(basePath, { recursive: true });

    await writeFile(
      path.join(basePath, 'pack.mcmeta'),
      JSON.stringify({
        pack: {
          description: {
            text: 'PST editor data',
          },
          pack_format: 15,
        },
      }),
    );

    const treesPath = path.join(basePath, 'data', 'skilltree', 'skill_trees');
    await mkdir(treesPath, { recursive: true });

    const mainTreePath = path.join(treesPath, 'main_tree.json');
    await writeFile(
      mainTreePath,
      JSON.stringify(config.tree.mainTree, null, 2),
    );

    const skillsPath = path.join(basePath, 'data', 'skilltree', 'skills');
    await mkdir(skillsPath, { recursive: true });

    const filesInsideSkills = await readdir(skillsPath);

    for await (const file of filesInsideSkills) {
      await unlink(path.join(skillsPath, file));
    }

    const skills = config.tree.nodes.map((node: Node) => ({
      ...node.data,
      label: undefined,
      projectId: undefined,
      modpackFolder: undefined,
      positionX: node.position.x,
      positionY: node.position.y,
      directConnections: config.tree.edges
        .filter((e: Edge) => e.source === node.id && e.data.type === 'direct')
        .map((e: Edge) => e.target),
      longConnections: config.tree.edges
        .filter((e: Edge) => e.source === node.id && e.data.type === 'long')
        .map((e: Edge) => e.target),
    }));

    for await (const skill of skills) {
      const skillWithoutMod = skill.id.split(':')[1];
      const skillPath = path.join(skillsPath, `${skillWithoutMod}.json`);
      await writeFile(skillPath, JSON.stringify(skill, null, 2));
    }
  }

  async postBuild() {}

  async initializeTree() {
    const configFile = await this.getConfigFromFiles(this.project.path);

    const updatedTree = {
      nodes: [] as any[],
      edges: [] as any[],
      mainTree: { skillIds: [] as any[], id: 'skilltree:main_tree' },
    };

    updatedTree.nodes = configFile.skills.map((cfg) => {
      return {
        id: cfg.id,
        position: { x: cfg.positionX, y: cfg.positionY },
        data: {
          ...cfg,
          modpackFolder: this.project.path,
          projectId: this.project.index,
        },
        type: 'skill_node',
      };
    });

    configFile.skills.forEach((skill) => {
      skill.directConnections.forEach((conn) => {
        updatedTree.edges.push({
          id: `${skill.id}_${conn}`,
          source: skill.id,
          target: conn,
          sourceHandle: 'main-source',
          targetHandle: 'direct-target',
          type: 'skill_edge',
          data: { type: 'direct' },
        });
      });

      skill.longConnections.forEach((conn) => {
        updatedTree.edges.push({
          id: `long_${skill.id}_${conn}`,
          source: skill.id,
          target: conn,
          sourceHandle: 'main-source',
          targetHandle: 'long-target',
          type: 'skill_edge',
          data: { type: 'long' },
        });
      });
    });

    updatedTree.mainTree.skillIds = configFile.skills.map((skill) => skill.id);

    return updatedTree;
  }

  async makeConfig(): Promise<ISkillTreeConfig> {
    return {
      tree: await this.initializeTree(),
    };
  }

  private async getConfigFromFiles(projectPath: string) {
    const basePath = path.join(
      projectPath,
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

    return { skillTree, skills };
  }
}
