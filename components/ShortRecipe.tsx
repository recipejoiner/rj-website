import * as React from 'react';

import { EdgeType } from 'components/InfiniteScroll';
import {ShortRecipeInfoType} from 'requests/recipes';

interface ShortRecipeProps {
  edge: EdgeType<ShortRecipeInfoType>;
}

const ShortRecipe: React.FC<ShortRecipeProps> = ({
  edge
}) => {
  const { node } = edge;
  const { id, by, title, description, servings } = node;
  return(
    <li
      key={id}
      className="my-5 p-5 bg-gray-100 rounded-lg shadow-lg"
    >
      <div className="text-xl">{id}</div>
      <h3>{title}</h3>
      <div>Chef: {by.username}</div>
      <div>{servings}</div>
      <p>{description}</p>
    </li>
  )
}

export default ShortRecipe;