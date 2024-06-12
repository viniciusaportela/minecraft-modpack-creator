import { DefaultMod } from '../default-mod';

export class KubeJS extends DefaultMod {
  // DEV add recipes
  async build() {
    // console.log('Building project...');
    // console.log(recipes);
    //
    // // TODO delete old data
    // // TODO generated based on type
    //
    // let index = 0;
    // for await (const recipe of recipes) {
    //   await ipcRenderer.invoke(
    //     'writeFile',
    //     `${project.path}kubejs/server_scripts/create-recipe-${index}.js`,
    //     `ServerEvents.recipes(event => {
    //       event.shaped(
    //         Item.of('${recipe.output}', ${recipe.outputCount}),
    //         ${JSON.stringify(getGrid(recipe))},
    //         ${JSON.stringify(getMapping(recipe))}
    //       )
    //     })`,
    //   );
    //   index += 1;
    // }
  }

  async preBuild() {}

  async postBuild() {}

  // private getMapping(recipe: IProjectStore['recipes'][0]) {
  //   let differentItems = 0;
  //   const charByIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  //   const mapping = {};
  //
  //   for (let row = 0; row < recipe.input.length; row++) {
  //     for (let col = 0; col < recipe.input[row].length; col++) {
  //       if (recipe.input[row][col] !== null) {
  //         const found = Object.values(mapping).find(
  //           (value) => value === recipe.input[row][col],
  //         );
  //
  //         if (!found) {
  //           mapping[charByIndex[differentItems]] = recipe.input[row][col];
  //           differentItems += 1;
  //         }
  //       }
  //     }
  //   }
  //
  //   return mapping;
  // }
  //
  // private getGrid(recipe: IProjectStore['recipes'][0]) {
  //   const mapping = this.getMapping(recipe);
  //
  //   const grid: string[][] = [];
  //   for (let row = 0; row < 3; row++) {
  //     let str = '';
  //     for (let col = 0; col < 3; col++) {
  //       const item = recipe.input[row][col];
  //       if (item === null) {
  //         str += ' ';
  //       } else {
  //         const [alias] = Object.entries(mapping).find(
  //           ([_, id]) => id === item,
  //         );
  //
  //         str += alias;
  //       }
  //     }
  //     grid.push(str);
  //   }
  //
  //   return grid;
  // }
}
