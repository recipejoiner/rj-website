import * as React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import { EdgeType } from 'components/InfiniteScroll';
import { ShortRecipeInfoType } from 'requests/recipes';
import { ensureVarIsSet } from 'helpers/methods';

interface ShortRecipeProps {
  edge: EdgeType<ShortRecipeInfoType>;
}

const ShortRecipe: React.FC<ShortRecipeProps> = ({
  edge
}) => {
  const { node } = edge;
  const { id, by, title, description, servings, handle } = node || {};
  let { username } = by || {};
  return(
    <li
      className="my-5 p-5 bg-white rounded-lg shadow-lg"
    >
      <Link href="/[username]/[recipehandle]" as={`/${username || '#'}/${handle || '#'}`}>
        <a>
          <h3 className="font-bold text-xl">{title || <Skeleton height={30} />}</h3>
          <div>Chef: {by.username || <Skeleton width={150} />}</div>
          <div>{servings || <Skeleton />}</div>
          <p>{description || <Skeleton />}</p>
        </a>
      </Link>
    </li>
  )
}

export default ShortRecipe;