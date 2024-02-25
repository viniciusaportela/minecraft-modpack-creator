import { CaretLeft } from '@phosphor-icons/react';
import { Button } from '@nextui-org/react';
import React, { useState } from 'react';
import ChooseType from '../ChooseType';
import AddShaped from './AddShaped';

interface IUpsertRecipeProps {
  setPage: React.Dispatch<React.SetStateAction<'recipes' | 'add-recipe'>>;
}

type ChosenType =
  | 'add-shaped'
  | 'add-shapeless'
  | 'add-smithing'
  | 'add-smelting'
  | 'add-stonecutting'
  | 'add-custom'
  | 'remove'
  | null;

const textByType: Record<Exclude<ChosenType, null>, string> = {
  'add-shaped': 'Add shaped recipe',
  'add-shapeless': 'Add shapeless recipe',
  'add-smithing': 'Add smithing',
  'add-smelting': 'Add smelting',
  'add-stonecutting': 'Add stonecutting',
  'add-custom': 'Add custom (For custom mod recipes)',
  remove: 'Remove recipe',
};

export default function AddRecipe({ setPage }: IUpsertRecipeProps) {
  const [chosenType, setChosenType] = useState<ChosenType>(null);

  const goBack = () => {
    if (chosenType) {
      setChosenType(null);
      return;
    }

    setPage('recipes');
  };

  const onAdded = () => {
    setPage('recipes');
  };

  return (
    <div>
      <div className="flex items-center">
        <Button
          variant="light"
          onPress={goBack}
          size="sm"
          className="p-2 min-w-4 mr-1"
        >
          <CaretLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">
          {chosenType ? textByType[chosenType] : 'Create recipe customization'}
        </h1>
      </div>

      {chosenType === null && (
        <div className="flex flex-col gap-2 mt-3">
          <ChooseType onChoose={() => setChosenType('add-shaped')}>
            Add Shaped Recipe
          </ChooseType>
          <ChooseType onChoose={() => setChosenType('add-shapeless')}>
            Add Shapeless recipe
          </ChooseType>
          <ChooseType onChoose={() => setChosenType('add-smithing')}>
            Add Smithing
          </ChooseType>
          <ChooseType onChoose={() => setChosenType('add-smelting')}>
            Add Smelting
          </ChooseType>
          <ChooseType onChoose={() => setChosenType('add-stonecutting')}>
            Add Stone Cutting
          </ChooseType>
          <ChooseType onChoose={() => setChosenType('add-custom')}>
            Add Custom (For custom mod recipes)
          </ChooseType>
          <ChooseType onChoose={() => setChosenType('remove')}>
            Remove Recipe
          </ChooseType>
        </div>
      )}
      {chosenType === 'add-shaped' && <AddShaped onAdded={onAdded} />}
    </div>
  );
}
