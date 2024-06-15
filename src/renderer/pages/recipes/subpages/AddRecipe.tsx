import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Tab,
  Tabs,
  Tooltip,
} from '@nextui-org/react';
import { Key, useState } from 'react';
import { ArrowLeft, PencilSimple, PenNib } from '@phosphor-icons/react';
import path from 'path';
import { usePager } from '../../../components/pager/hooks/usePager';
import { useRecipesStore } from '../../../store/recipes.store';
import { ComponentByRecipeType } from '../helpers/component-by-recipe-type';
import Title from '../../../components/title/Title';
import RawRecipeEditor from '../components/RawRecipeEditor';
import { DEFAULT_RECIPE_JSON } from '../helpers/default-recipe-json';
import SimpleCodeEditor from '../../../components/simple-code-editor/SimpleCodeEditor';

export default function AddRecipe() {
  const { navigate } = usePager();

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

  const [chosenRecipeType, setChosenRecipeType] = useState(
    'minecraft:crafting_shaped',
  );
  const [recipeName, setRecipeName] = useState('name_of_recipe');
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
    }
  };

  const onAdded = () => {
    navigate('recipe-list');
  };

  const onChangeExample = (index: Key) => {
    const recipe = useRecipesStore
      .getState()
      .recipes.find((r) => r.index === parseInt(index, 10));
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

  const renderPage = () => {
    const CustomComponent =
      ComponentByRecipeType[
        chosenRecipeType as keyof typeof ComponentByRecipeType
      ];

    return editorType === 'refined' && CustomComponent ? (
      <CustomComponent
        onChange={setRecipeJson}
        json={recipeJson}
        onAdded={onAdded}
      />
    ) : (
      <RawRecipeEditor
        json={recipeJson}
        className="flex-1"
        onChange={setRecipeJson}
      />
    );
  };

  return (
    <>
      <div className="flex">
        <Title goBack={() => navigate('recipe-list')} className="mb-3">
          Add Custom Recipe
        </Title>
        <Title className="ml-auto w-[350px]">Templates</Title>
      </div>

      <div className="flex flex-1 gap-4">
        <div className="flex flex-col flex-1">
          <div className="flex gap-2">
            <Input
              value={recipeName}
              onValueChange={setRecipeName}
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
          <div className="mt-3 flex-1">{renderPage()}</div>
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

          <SimpleCodeEditor
            data={exampleJson}
            fileType="json"
            readOnly
            style={{ minHeight: 'auto', flex: 1 }}
          />
        </div>
      </div>
    </>
  );
}
