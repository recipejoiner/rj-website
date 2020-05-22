import * as React from 'react';
import Skeleton from 'react-loading-skeleton';

import { EdgeType } from 'components/InfiniteScroll';
import { ShortRecipeInfoType } from 'requests/recipes';

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
      className="my-5 p-5 bg-gray-100 rounded-lg shadow-lg"
    >
      <h3 className="font-bold text-xl">{title || <Skeleton height={30} />}</h3>
      <div>Chef: {by.username || <Skeleton width={150} />}</div>
      <div>{servings || <Skeleton />}</div>
      <p>{description || <Skeleton />}</p>
    </li>
  )
}

export default ShortRecipe;