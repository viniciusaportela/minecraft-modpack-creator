import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from '@nextui-org/react';
import { Funnel, Plus } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { usePager } from '../../../components/pager/hooks/usePager';
import Title from '../../../components/title/Title';
import {
  useProjectSelector,
  useProjectStore,
} from '../../../store/hooks/use-project-store';
import CustomRecipeCard from '../components/CustomRecipeCard';
import { useRecipesStore } from '../../../store/recipes.store';
import { RecipeCard, RecipeCardItemWrapper } from '../components/RecipeCard';
import { IRecipe } from '../../../store/interfaces/recipes-store.interface';

export default function RecipeList() {
  const { navigate } = usePager();

  const configStore = useProjectStore();
  const customRecipes = useProjectSelector((st) => st.recipes);

  const allRecipes = useRecipesStore((st) => st.recipes);
  const recipesTypes = useRecipesStore((st) => st.types);

  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);

  const [idFilter, setIdFilter] = useState('');
  const [inputFilter, setInputFilter] = useState('');
  const [outputFilter, setOutputFilter] = useState('');
  const [modFilter, setModFilter] = useState('');
  const [removedOnlyFilter, setRemovedOnlyFilter] = useState(false);
  const [modifiedOnlyFilter, setModifiedOnlyFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  const filter = (recipes: any[]) => {
    const filtered = recipes;

    if (removedOnlyFilter) {
      // Look for custom recipes that are removed
    }

    if (modifiedOnlyFilter) {
      // ...
    }

    return filtered;
  };

  const isFilterActive = () => {
    return (
      idFilter ||
      inputFilter ||
      outputFilter ||
      modFilter ||
      removedOnlyFilter ||
      modifiedOnlyFilter ||
      typeFilter
    );
  };

  const filteredRecipes = filter(allRecipes);

  const onSelectRecipe = useCallback(
    (recipe: IRecipe) => {
      const alreadySelected = selectedRecipes.includes(recipe.index);

      if (alreadySelected) {
        setSelectedRecipes((prev) => prev.filter((r) => r !== recipe.index));
      } else {
        setSelectedRecipes((prev) => [...prev, recipe.index]);
      }
    },
    [selectedRecipes],
  );

  return (
    <>
      <Title>Your custom recipes</Title>

      <div className="h-72">
        {customRecipes.length === 0 && (
          <Button
            className="border-1 border-dashed border-zinc-700 h-fit w-full p-5 mt-3"
            variant="light"
            onPress={() => navigate('add-recipe')}
          >
            <div className="flex flex-col gap-1">
              <i className="text-zinc-500">No recipes found.</i>
              <div className="flex items-center gap-1">
                <Plus />
                <span className="font-bold">Create or Customize Recipes</span>
              </div>
            </div>
          </Button>
        )}

        {customRecipes.length > 0 && (
          <div className="flex flex-col gap-2 mt-3">
            <Button
              className="border-1 border-dashed border-zinc-700 h-fit w-full p-5 mt-3"
              variant="light"
              onPress={() => navigate('add-recipe')}
            >
              <div className="flex gap-1 items-center">
                <Plus />
                <span className="font-bold">New recipe</span>
              </div>
            </Button>
            {customRecipes.map((r, index) => (
              <CustomRecipeCard
                customRecipe={r}
                onDelete={() =>
                  configStore.setState((st) => {
                    st.recipes.splice(index, 1);
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      <Divider className="mb-2" />
      <div className="flex justify-between">
        <div>
          <Title>All recipes</Title>
          <i className="text-sm text-zinc-500">
            You can remove and modify recipes here
          </i>
        </div>

        <Popover showArrow placement="bottom">
          <PopoverTrigger>
            <Button isIconOnly color={isFilterActive() ? 'primary' : undefined}>
              <Funnel />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col py-4 px-1 gap-4">
              <div className="gap-4 flex">
                <div>
                  <span>Recipe ID</span>
                  <Input
                    size="sm"
                    classNames={{ inputWrapper: 'h-10' }}
                    value={idFilter}
                    onValueChange={(txt) => setIdFilter(txt)}
                  />
                </div>
                <div>
                  <span>Mod ID</span>
                  <Input
                    size="sm"
                    classNames={{ inputWrapper: 'h-10' }}
                    value={modFilter}
                    onValueChange={(txt) => setModFilter(txt)}
                  />
                </div>
              </div>
              <div className="gap-4 flex">
                <div>
                  <span>Input Filter</span>
                  <Input
                    size="sm"
                    classNames={{ inputWrapper: 'h-10' }}
                    value={inputFilter}
                    onValueChange={(txt) => setInputFilter(txt)}
                  />
                </div>
                <div>
                  <span>Output Filter</span>
                  <Input
                    size="sm"
                    classNames={{ inputWrapper: 'h-10' }}
                    value={outputFilter}
                    onValueChange={(txt) => setOutputFilter(txt)}
                  />
                </div>
              </div>
              <div className="gap-4 flex">
                <div className="flex-1">
                  <span>By Type</span>
                  <Autocomplete
                    inputValue={typeFilter}
                    onInputChange={(key) => setTypeFilter(key)}
                    allowsCustomValue
                    inputProps={{ classNames: { inputWrapper: 'h-10' } }}
                  >
                    {recipesTypes.map((item) => (
                      <AutocompleteItem key={item}>{item}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>
              <div className="gap-4 flex">
                <Switch
                  isSelected={removedOnlyFilter}
                  onValueChange={(val) => setRemovedOnlyFilter(val)}
                >
                  Show removed only
                </Switch>
              </div>
              <div className="gap-4 flex">
                <Switch
                  isSelected={modifiedOnlyFilter}
                  onValueChange={(val) => setModifiedOnlyFilter(val)}
                >
                  Show modified only
                </Switch>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-1">
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              columnCount={Math.floor(width / 270)}
              rowCount={filteredRecipes.length / Math.floor(width / 270)}
              columnWidth={270}
              rowHeight={110}
              itemData={{
                filteredRecipes,
                selectedRecipes,
                onSelectRecipe,
                width,
              }}
              height={height}
              width={width}
            >
              {RecipeCardItemWrapper}
            </Grid>
          )}
        </AutoSizer>
      </div>
    </>
  );
}
