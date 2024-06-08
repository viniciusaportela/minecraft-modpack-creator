import path from 'path';
import { cp, stat } from 'node:fs/promises';
import recursive from 'recursive-readdir';
import { Stats } from 'node:fs';
import { DefaultMod } from '../default-mod';
import { ConfigLoader } from '../../minecraft/config/ConfigLoader';
import BusinessLogicError from '../../../errors/business-logic-error';
import { ParserFactory } from '../../minecraft/config/parser/parser-factory';
import { BusinessError } from '../../../errors/business-error.enum';

export class Minecraft extends DefaultMod {
  async build() {
    const baseFolders = ConfigLoader.getBaseFolders();

    const finalSourcePaths = baseFolders.map((p) =>
      path.join(this.project.path, 'minecraft-toolkit', 'configs', p),
    );
    const finalDestinationPaths = baseFolders.map((p) =>
      path.join(this.project.path, p),
    );

    const promises = finalSourcePaths.map(async (finalPath) => {
      const allPaths = await recursive(finalPath);

      const pathsWithStat = (await Promise.all(
        allPaths.map(async (p) => [p, await stat(p)]),
      )) as [string, Stats][];
      const filesOnly = pathsWithStat.filter(async ([_, stat]) =>
        stat.isFile(),
      );

      const promises = filesOnly.map(async ([filePath]) => {
        const extension = path.extname(filePath).replace('.', '');
        const parser = ParserFactory.get(extension);

        if (parser) {
          const { error } = await parser.isFileValid(filePath);

          if (error) {
            const relativePath = filePath.replace(this.project.path, '');
            throw new BusinessLogicError({
              code: BusinessError.BuildError,
              message: `The following path have a malformed content: ${filePath}, error: ${error}`,
              meta: {
                error,
                mod: this.mod,
                descriptiveError: `Config ${relativePath} is invalid`,
              },
            });
          }
        }
      });

      await Promise.all(promises);
    });
    await Promise.all(promises);

    const copyPromises = finalSourcePaths.map((finalPath, index) =>
      cp(finalPath, finalDestinationPaths[index], {
        recursive: true,
      }),
    );
    await Promise.all(copyPromises);
  }
}
