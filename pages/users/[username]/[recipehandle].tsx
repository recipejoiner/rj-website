import * as React from 'react';
import { NextPage } from 'next';

import { RecipeType } from 'requests/recipes';
import client from 'requests/client';

interface RecipeProps {
  recipe: RecipeType;
}

const RecipePage: NextPage<RecipeProps> = ({
  recipe
}) => {
  return(
    <React.Fragment>
      <div>
        Recipe page!
      </div>
    </React.Fragment>
  );
}

export default RecipePage;