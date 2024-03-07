import path from 'path';
import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { Edge, Node } from 'reactflow';
import { useAppStore } from '../../../../store/app.store';
import { ModModel } from '../../../models/mod.model';
import { ProjectModel } from '../../../models/project.model';

export class SkillTree {
  static async build(project: ProjectModel, mod: ModModel) {
    const config = mod.getConfig();
    console.log('build', config);

    const mainTreePath = path.join(
      project.path,
      'skilltree',
      'editor',
      'data',
      'skilltree',
      'skill_trees',
      'main_tree.json',
    );
    await writeFile(
      mainTreePath,
      JSON.stringify(config.tree.mainTree, null, 2),
    );

    const skills = config.tree.nodes.map((node: Node) => ({
      ...node.data,
      projectId: undefined,
      modpackFolder: undefined,
      directConnections: config.tree.edges
        .filter((e: Edge) => e.source === node.id && e.data.type === 'direct')
        .map((e: Edge) => e.id),
      longConnections: config.tree.edges
        .filter((e: Edge) => e.source === node.id && e.data.type === 'long')
        .map((e: Edge) => e.id),
    }));

    for await (const skill of skills) {
      const skillPath = path.join(
        project.path,
        'skilltree',
        'editor',
        'data',
        'skilltree',
        'skills',
        `${skill.id}.json`,
      );
      await writeFile(skillPath, JSON.stringify(skill, null, 2));
    }
  }

  static async preBuild(project: ProjectModel, mod: ModModel) {}

  static async postBuild(project: ProjectModel, mod: ModModel) {
    const skillsPath = path.join(
      project.path,
      'skilltree',
      'editor',
      'data',
      'skilltree',
      'skills',
    );

    const files = await readdir(skillsPath);

    const allValidSkills = mod
      .getConfig()
      .tree.nodes.map((node: Node) => `${node.id}.json`);

    const promises = files.map(async (file) => {
      if (!allValidSkills.includes(file)) {
        await unlink(path.join(skillsPath, file));
      }
    });

    await Promise.all(promises);
  }

  static async initializeConfig(
    mod: ModModel,
    config: Record<string, unknown>,
  ) {
    const { realm } = useAppStore.getState();
    const project = realm.objectForPrimaryKey<ProjectModel>(
      'Project',
      mod.project,
    )!;

    const configFile = await this.getConfigFromFiles(project.path);

    const updatedCfg = {
      ...config,
      initialized: true,
      tree: {
        nodes: [] as any[],
        edges: [] as any[],
        mainTree: { skillIds: [] as any[], id: 'skilltree:main_tree' },
      },
    };

    // get logic from EditTree
    updatedCfg.tree.nodes = configFile.skills.map((cfg) => {
      return {
        id: cfg.id,
        position: { x: cfg.positionX, y: cfg.positionY },
        data: { ...cfg, modpackFolder: project.path, projectId: project._id },
        type: 'skill_node',
      };
    });

    configFile.skills.forEach((skill) => {
      skill.directConnections.forEach((conn) => {
        updatedCfg.tree.edges.push({
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
        updatedCfg.tree.edges.push({
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

    updatedCfg.tree.mainTree.skillIds = configFile.skills.map(
      (skill) => skill.id,
    );

    mod.writeConfig(updatedCfg);
  }

  static updateMainTree(mod: ModModel) {
    const config = mod.getConfig();
    config.tree.mainTree.skillIds = config.tree.nodes.map((node) => node.id);

    mod.writeConfig(config);
  }

  private static async getConfigFromFiles(projectPath: string) {
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
