import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { Funnel, Plus } from '@phosphor-icons/react';
import { useState } from 'react';
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
import { RecipeCard } from '../components/RecipeCard';

export default function RecipeList() {
  const { navigate } = usePager();

  const configStore = useProjectStore();
  const customRecipes = useProjectSelector((st) => st.recipes);

  const allRecipes = useRecipesStore((st) => st.recipes);
  const recipesTypes = useRecipesStore((st) => st.types);

  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);

  const [nameFilter, setNameFilter] = useState('');
  const [inputFilter, setInputFilter] = useState('');
  const [outputFilter, setOutputFilter] = useState('');
  const [modFilter, setModFilter] = useState('');
  const [removedOnlyFilter, setRemovedOnlyFilter] = useState(false);
  const [modifiedOnlyFilter, setModifiedOnlyFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  const filter = (recipes: any[]) => {
    return recipes;
  };

  const isFilterActive = () => {
    return (
      nameFilter ||
      inputFilter ||
      outputFilter ||
      modFilter ||
      removedOnlyFilter ||
      modifiedOnlyFilter ||
      typeFilter
    );
  };

  const filteredRecipes = filter(allRecipes);

  console.log(recipesTypes);

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
                  <Input size="sm" classNames={{ inputWrapper: 'h-10' }} />
                </div>
                <div>
                  <span>Mod ID</span>
                  <Input size="sm" classNames={{ inputWrapper: 'h-10' }} />
                </div>
              </div>
              <div className="gap-4 flex">
                <div>
                  <span>Input Filter</span>
                  <Input size="sm" classNames={{ inputWrapper: 'h-10' }} />
                </div>
                <div>
                  <span>Output Filter</span>
                  <Input size="sm" classNames={{ inputWrapper: 'h-10' }} />
                </div>
              </div>
              <div className="gap-4 flex">
                <div className="flex-1">
                  <span>By Type</span>
                  <Autocomplete
                    allowsCustomValue
                    inputProps={{ classNames: { inputWrapper: 'h-10' } }}
                  >
                    {recipesTypes.map((item) => (
                      <AutocompleteItem key={item}>{item}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="flex-1" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="overflow-y-auto flex flex-1 flex-wrap gap-2 pt-4">
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              columnCount={Math.floor(width / 270)}
              rowCount={filteredRecipes.length / Math.floor(width / 270)}
              columnWidth={270}
              rowHeight={110}
              height={height}
              width={width}
            >
              {({ style, rowIndex, columnIndex }) => {
                return (
                  <div className="pr-[10px]" style={style}>
                    <RecipeCard
                      recipe={
                        filteredRecipes[
                          rowIndex * Math.floor(width / 270) + columnIndex
                        ]
                      }
                    />
                  </div>
                );
              }}
            </Grid>
          )}
        </AutoSizer>
      </div>
    </>
  );
}
