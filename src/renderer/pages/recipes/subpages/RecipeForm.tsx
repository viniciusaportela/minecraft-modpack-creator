import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Tab,
  Tabs,
  Tooltip,
} from '@nextui-org/react';
import { Key, useEffect, useState } from 'react';
import { ArrowLeft, PencilSimple, PenNib } from '@phosphor-icons/react';
import path from 'path';
import { usePager } from '../../../components/pager/hooks/usePager';
import { useRecipesStore } from '../../../store/recipes.store';
import { ComponentByRecipeType } from '../helpers/component-by-recipe-type';
import Title from '../../../components/title/Title';
import RawRecipeEditor from '../components/RawRecipeEditor';
import { DEFAULT_RECIPE_JSON } from '../helpers/default-recipe-json';
import SimpleCodeEditor from '../../../components/simple-code-editor/SimpleCodeEditor';
import {
  useProjectSelector,
  useProjectStore,
} from '../../../store/hooks/use-project-store';
import { isCustomRecipe } from '../../../store/interfaces/project-store.interface';

export default function RecipeForm() {
  const { navigate } = usePager();

  const projectStore = useProjectStore();

  const selectedRecipe = useProjectSelector((st) => st.selectedRecipe);
  const recipeTypes = useRecipesStore((st) => ['custom', ...st.types]);

  const stringifiedRecipeOfType = (type: string) => {
    const found = useRecipesStore
      .getState()
      .recipes.find((r) => r.type === type);

    if (!found) {
      return '{}';
    }

    return JSON.stringify(
      { ...found, filePath: undefined, index: undefined },
      null,
      2,
    );
  };

  const findRecipesOfType = (type: string) => {
    return useRecipesStore.getState().recipes.filter((r) => r.type === type);
  };

  const findRecipe = (type: string) => {
    return useRecipesStore.getState().recipes.find((r) => r.type === type);
  };

  const findRecipeIndex = (type: string) => {
    const { recipes } = useRecipesStore.getState();
    const recipe = recipes.find((r) => r.type === type);
    return recipe ? recipe.index : undefined;
  };

  useEffect(() => {
    console.log('RecipeForm');
  }, []);

  const [chosenRecipeType, setChosenRecipeType] = useState(
    'minecraft:crafting_shaped',
  );
  const [recipeName, setRecipeName] = useState('Name of recipe');
  const [editorType, setEditorType] = useState('refined');
  const [recipeJson, setRecipeJson] = useState(DEFAULT_RECIPE_JSON);
  const [exampleJson, setExampleJson] = useState(
    stringifiedRecipeOfType(chosenRecipeType),
  );
  const [recipesOfCurrentType, setRecipesOfCurrentType] = useState(
    findRecipesOfType(chosenRecipeType),
  );
  const [chosenExample, setChosenExample] = useState(
    findRecipeIndex(chosenRecipeType),
  );

  useEffect(() => {
    if (selectedRecipe) {
      if (isCustomRecipe(selectedRecipe)) {
        setRecipeJson(selectedRecipe.json);
        setRecipeName(selectedRecipe.name);
        setChosenRecipeType(JSON.parse(selectedRecipe.json)?.type ?? 'custom');
      } else {
        const wasEdited = projectStore
          .getState()
          .editedRecipes.find((er) => er.filePath === selectedRecipe.filePath);

        setRecipeJson(
          wasEdited
            ? wasEdited.json
            : JSON.stringify(
                {
                  ...selectedRecipe,
                  filePath: undefined,
                  index: undefined,
                  mod: undefined,
                  id: undefined,
                },
                null,
                2,
              ),
        );
        setRecipeName(selectedRecipe.filePath);
        setChosenRecipeType(selectedRecipe.type ?? 'custom');
      }
    } else {
      setRecipeJson(DEFAULT_RECIPE_JSON);
      setRecipeName('Name of recipe');
      setChosenRecipeType('minecraft:crafting_shaped');
    }
  }, [selectedRecipe]);

  const hasRefinedEditor = () => {
    return !!ComponentByRecipeType[
      chosenRecipeType as keyof typeof ComponentByRecipeType
    ];
  };

  const updateRecipeType = (type: Key) => {
    setChosenRecipeType(type as string);
    setRecipesOfCurrentType(findRecipesOfType(type as string));

    const exampleRecipe = findRecipe(type as string);

    if (exampleRecipe) {
      setExampleJson(
        JSON.stringify(
          { ...exampleRecipe, filePath: undefined, index: undefined },
          null,
          2,
        ),
      );
      setChosenExample(exampleRecipe.index);
    } else {
      setExampleJson('');
      setChosenExample(undefined);
    }
  };

  const onChangeExample = (index: Key) => {
    const recipe = useRecipesStore
      .getState()
      .recipes.find((r) => r.index === parseInt(index as string, 10));
    if (recipe) {
      setExampleJson(
        JSON.stringify(
          { ...recipe, filePath: undefined, index: undefined },
          null,
          2,
        ),
      );
      setChosenExample(recipe.index);
    }
  };

  const onCopyExample = () => {
    setRecipeJson(exampleJson);
  };

  const addRecipe = (json: string) => {
    projectStore.setState((st) => {
      st.selectedRecipe = null;
      st.addedRecipes.push({
        index: st.addedRecipes.length,
        isCustomRecipe: true,
        name: recipeName,
        json,
      });
    });

    navigate('recipe-list');
  };

  const editRecipe = (json: string) => {
    if (isCustomRecipe(selectedRecipe)) {
      projectStore.setState((st) => {
        st.selectedRecipe = null;
        st.addedRecipes[selectedRecipe.index] = {
          ...selectedRecipe,
          json,
        };
      });
    } else if (selectedRecipe) {
      const editedIndex = projectStore
        .getState()
        .editedRecipes.findIndex(
          (er) => er.filePath === selectedRecipe?.filePath,
        );

      if (editedIndex !== -1) {
        projectStore.setState((st) => {
          st.selectedRecipe = null;
          st.editedRecipes[editedIndex] = {
            ...st.editedRecipes[editedIndex],
            json,
          };
        });
      } else {
        projectStore.setState((st) => {
          st.selectedRecipe = null;
          st.editedRecipes.push({
            filePath: selectedRecipe.filePath ?? '',
            json,
          });
        });
      }
    }

    navigate('recipe-list');
  };

  const renderPage = () => {
    const CustomComponent =
      ComponentByRecipeType[
        chosenRecipeType as keyof typeof ComponentByRecipeType
      ];

    return editorType === 'refined' && CustomComponent ? (
      <CustomComponent
        onChange={setRecipeJson}
        json={recipeJson}
        onAdded={addRecipe}
        onEdited={editRecipe}
        isEdit={!!selectedRecipe}
      />
    ) : (
      <RawRecipeEditor
        json={recipeJson}
        className="flex-1"
        onChange={setRecipeJson}
        onAdded={addRecipe}
        onEdited={editRecipe}
        isEdit={!!selectedRecipe}
      />
    );
  };

  return (
    <>
      <div className="flex">
        <Title
          goBack={() => {
            projectStore.setState({ selectedRecipe: null });
            navigate('recipe-list');
          }}
          className="mb-3"
        >
          {selectedRecipe ? 'Edit recipe' : 'Add custom Recipe'}
        </Title>
        <Title className="ml-auto w-[350px]">Templates</Title>
      </div>

      <div className="flex flex-1 gap-4">
        <div className="flex flex-col flex-1">
          <div className="flex gap-2">
            <Input
              value={recipeName}
              onValueChange={setRecipeName}
              isDisabled={!!selectedRecipe && !isCustomRecipe(selectedRecipe)}
              size="sm"
              classNames={{ inputWrapper: 'h-10' }}
            />
            {hasRefinedEditor() && (
              <Tabs
                onSelectionChange={(key) => setEditorType(key as string)}
                selectedKey={editorType}
              >
                <Tab title={<PenNib />} key="refined" />
                <Tab title={<PencilSimple />} key="raw" />
              </Tabs>
            )}
          </div>
          <div className="mt-3 flex-1 flex flex-col">{renderPage()}</div>
        </div>
        <div className="flex flex-col w-[350px] min-w-[350px] gap-2">
          <Autocomplete
            isClearable={false}
            size="sm"
            selectedKey={chosenRecipeType}
            onSelectionChange={updateRecipeType}
            inputProps={{
              classNames: {
                inputWrapper: 'h-10',
              },
            }}
          >
            {recipeTypes.map((type) => (
              <AutocompleteItem key={type}>{type}</AutocompleteItem>
            ))}
          </Autocomplete>
          <div className="flex gap-2">
            <Tooltip content="Copy">
              <Button isIconOnly onPress={onCopyExample}>
                <ArrowLeft />
              </Button>
            </Tooltip>
            <Autocomplete
              onSelectionChange={onChangeExample}
              defaultItems={recipesOfCurrentType}
              selectedKey={String(chosenExample)}
              isClearable={false}
              inputProps={{ classNames: { inputWrapper: 'h-10' } }}
            >
              {(recipe) => (
                <AutocompleteItem key={recipe.index}>
                  {path.basename(recipe.filePath)}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          <div className="flex-1">
            <SimpleCodeEditor
              data={exampleJson}
              fileType="json"
              readOnly
              style={{ minHeight: 'auto', flex: 1 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
