import React from 'react';
import ChooseType from '../components/ChooseType';
import { usePager } from '../../../components/pager/hooks/usePager';
import Title from '../../../components/title/Title';

export default function AddRecipeList() {
  const { navigate } = usePager();

  return (
    <div className="flex flex-col gap-2">
      <Title goBack={() => navigate('recipe-list')} className="mb-2">
        Create recipe customization
      </Title>
      <ChooseType onChoose={() => navigate('add-shaped-recipe')}>
        Add Shaped Recipe
      </ChooseType>
      <ChooseType onChoose={() => navigate('add-shapeless')}>
        Add Shapeless recipe
      </ChooseType>
      <ChooseType onChoose={() => navigate('add-smithing')}>
        Add Smithing
      </ChooseType>
      <ChooseType onChoose={() => navigate('add-smelting')}>
        Add Smelting
      </ChooseType>
      <ChooseType onChoose={() => navigate('add-stonecutting')}>
        Add Stone Cutting
      </ChooseType>
      <ChooseType onChoose={() => navigate('add-custom')}>
        Add Custom (For custom mod recipes)
      </ChooseType>
      <ChooseType onChoose={() => navigate('remove')}>Remove Recipe</ChooseType>
    </div>
  );
}
