import path from 'path';
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { Edge, Node } from 'reactflow';
import { BaseMod } from '../base-mod';

export class SkillTree extends BaseMod {
  async build() {
    const config = this.config.parseConfig();

    const basePath = path.join(
      this.project.path,
      'generated_datapacks',
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

    const skills = config.tree.nodes.map((node: Node) => ({
      ...node.data,
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

  async postBuild() {
    const skillsPath = path.join(
      this.project.path,
      'skilltree',
      'editor',
      'data',
      'skilltree',
      'skills',
    );

    const files = await readdir(skillsPath);

    const allValidSkills = this.config
      .parseConfig()
      .tree.nodes.map((node: Node) => `${node.id.split(':')[1]}.json`);

    const promises = files.map(async (file) => {
      if (!allValidSkills.includes(file)) {
        await unlink(path.join(skillsPath, file));
      }
    });

    await Promise.all(promises);
  }

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
          projectId: this.project._id,
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

  async initializeConfig(config: any) {
    return {
      ...config,
      initialized: true,
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
