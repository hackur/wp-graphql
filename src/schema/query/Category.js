import { GraphQLInt } from 'graphql';

import CategoryCollectionType from 'type/Category/Collection';
import CategoryType from 'type/Category';
import Category from 'data/Category';
import { itemResolver } from 'utils';
import { pagination, filter, slug, taxonomy } from 'query/args';

export default {
  categories: {
    type: CategoryCollectionType,
    args: {
      ...pagination,
      ...filter,
      ...slug,
      ...taxonomy,
      parent: {
        type: GraphQLInt,
        description: 'Limit result set to terms assigned to a specific parent.',
      },
    },
    resolve: (root, args) => ({ args }),
  },
  category: itemResolver(CategoryType, Category),
};