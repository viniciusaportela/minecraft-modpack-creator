import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Divider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from '@nextui-org/react';
import {
  ArrowCounterClockwise,
  CheckSquare,
  Funnel,
  Plus,
  TrashSimple,
} from '@phosphor-icons/react';
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
import {
  ICustomRecipe,
  isCustomRecipe,
} from '../../../store/interfaces/project-store.interface';

export default function RecipeList() {
  const { navigate } = usePager();

  const projectStore = useProjectStore();
  const customRecipes = useProjectSelector((st) => st.addedRecipes);
  const deletedRecipes = useProjectSelector((st) => st.deletedRecipes);
  const editedRecipes = useProjectSelector((st) => st.editedRecipes);

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

  const switchSelection = () => {
    if (selectedRecipes.length > 0) {
      setSelectedRecipes([]);
    } else {
      setSelectedRecipes(filteredRecipes.map((r) => r.index));
    }
  };

  const isToShowDelete = () => {
    const selectedFilePaths = selectedRecipes.map(
      (index) => allRecipes[index].filePath,
    );

    const deletedRecipePaths = projectStore
      .getState()
      .deletedRecipes.map((deleted) => deleted.filePath);

    return selectedFilePaths.some(
      (selected) => !deletedRecipePaths.includes(selected),
    );
  };

  const isToShowRestore = () => {
    const selectedFilePaths = selectedRecipes.map(
      (index) => allRecipes[index].filePath,
    );

    const hasAnySelectedDeleted = projectStore
      .getState()
      .deletedRecipes.some((dr) => selectedFilePaths.includes(dr.filePath));

    if (hasAnySelectedDeleted) {
      return true;
    }

    const hasAnySelectedEdited = projectStore
      .getState()
      .editedRecipes.some((er) => selectedFilePaths.includes(er.filePath));

    return hasAnySelectedEdited;
  };

  const bulkRestore = () => {
    const selectedPaths = selectedRecipes.map(
      (rIndex) => allRecipes[rIndex].filePath,
    );

    // restore edit and delete
    projectStore.setState((st) => {
      st.deletedRecipes = st.deletedRecipes.filter(
        (dr) => !selectedPaths.includes(dr.filePath),
      );

      st.editedRecipes = st.editedRecipes.filter(
        (er) => !selectedPaths.includes(er.filePath),
      );
    });

    setSelectedRecipes([]);
  };

  const bulkDelete = () => {
    const currentDeleted = projectStore.getState().deletedRecipes;

    const onlyNonDeleted = selectedRecipes.filter((index) => {
      const toDeleteRecipe = allRecipes[index];
      return !currentDeleted.some(
        (deleted) => deleted.filePath === toDeleteRecipe.filePath,
      );
    });

    const newDeleted = onlyNonDeleted.map((index) => {
      const recipe = allRecipes[index];
      return {
        filePath: recipe.filePath,
      } as const;
    });

    projectStore.setState((st) => {
      st.deletedRecipes.push(...newDeleted);
    });

    setSelectedRecipes([]);
  };

  const onRestoreRecipe = (recipe: IRecipe) => {
    const isDeleted = projectStore
      .getState()
      .deletedRecipes.some((dr) => dr.filePath === recipe.filePath);

    if (isDeleted) {
      projectStore.setState((st) => {
        st.deletedRecipes = st.deletedRecipes.filter(
          (dr) => dr.filePath !== recipe.filePath,
        );
      });
      return;
    }

    const isEdited = projectStore
      .getState()
      .editedRecipes.some((er) => er.filePath === recipe.filePath);
    if (isEdited) {
      projectStore.setState((st) => {
        st.editedRecipes = st.editedRecipes.filter(
          (er) => er.filePath !== recipe.filePath,
        );
      });
    }
  };

  const onDelete = (recipe: IRecipe | ICustomRecipe) => {
    if (isCustomRecipe(recipe)) {
      // ...
    } else {
      const isDeleted = projectStore
        .getState()
        .deletedRecipes.some((dr) => dr.filePath === recipe.filePath);

      if (isDeleted) {
        return;
      }

      projectStore.setState((st) => {
        st.deletedRecipes.push({
          filePath: recipe.filePath,
        });
      });
    }
  };

  const onEdit = (recipe: IRecipe | ICustomRecipe) => {
    if (isCustomRecipe(recipe)) {
      // ...
    } else {
      navigate('recipe-form');
      projectStore.setState((st) => {
        st.selectedRecipe = recipe;
      });
    }
  };

  const onClickAddButton = () => {
    navigate('recipe-form');
    projectStore.setState((st) => {
      st.selectedRecipe = null;
    });
  };

  console.log(customRecipes);

  return (
    <>
      <div className="flex">
        <Title>Your custom recipes</Title>
        <Button
          color="primary"
          size="sm"
          className="min-w-10 min-h-10 ml-auto mr-3"
          onPress={onClickAddButton}
        >
          <Plus size={16} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col">
        {customRecipes.length === 0 && (
          <Button
            className="border-1 border-dashed border-zinc-700 h-fit w-full p-5 mt-3"
            variant="light"
            onPress={() => navigate('recipe-form')}
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

        <div className="mt-3 gap-2 flex flex-col flex-1">
          <AutoSizer>
            {({ height, width }) => (
              <Grid
                columnCount={Math.floor(width / 270)}
                rowCount={customRecipes.length / Math.floor(width / 270)}
                columnWidth={270}
                rowHeight={110}
                itemData={{
                  data: customRecipes,
                  onEdit,
                  onDelete,
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
      </div>

      <Divider className="mb-2" />
      <div className="flex-1 flex flex-col">
        <div className="flex">
          <div className="mr-auto">
            <Title>All recipes</Title>
            <i className="text-sm text-zinc-500">
              You can remove and modify recipes here
            </i>
          </div>

          {selectedRecipes.length > 0 && (
            <div className="mr-2">
              <span className="text-sm mr-2">
                {selectedRecipes.length} selected
              </span>
              {isToShowRestore() && (
                <Button
                  isIconOnly
                  color="primary"
                  className="mr-1"
                  onPress={bulkRestore}
                >
                  <ArrowCounterClockwise />
                </Button>
              )}
              {isToShowDelete() && (
                <Button isIconOnly color="primary" onPress={bulkDelete}>
                  <TrashSimple />
                </Button>
              )}
            </div>
          )}

          <Button isIconOnly className="mr-1" onPress={switchSelection}>
            <CheckSquare size={16} />
          </Button>

          <Popover showArrow placement="bottom">
            <PopoverTrigger>
              <Button
                isIconOnly
                color={isFilterActive() ? 'primary' : undefined}
              >
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
                  data: filteredRecipes,
                  selectedRecipes,
                  deletedRecipes,
                  editedRecipes,
                  onSelectRecipe,
                  onEdit,
                  onDelete,
                  width,
                  onRestoreRecipe,
                }}
                height={height}
                width={width}
              >
                {RecipeCardItemWrapper}
              </Grid>
            )}
          </AutoSizer>
        </div>
      </div>
    </>
  );
}
