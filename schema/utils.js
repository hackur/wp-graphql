import { GraphQLInt } from 'graphql';

import request from 'data';

export const resolveWithArgs = path => (root, args) => {
  const opts = {};
  if (Object.keys(args).length > 0) {
    opts.qs = args;
  }
  return request(path, opts);
};

export const itemResolver = (dataType, loader) => ({
  type: dataType,
  args: {
    id: { type: GraphQLInt },
  },
  // eslint-disable-next-line no-confusing-arrow
  resolve: (root, { id }) => loader.load(id),
});

export const metaResolver = (data) => {
  if (!data.meta || !data.meta.length) {
    return null;
  }
  return Object.keys(data.meta).map(key => ({
    key,
    value: data.meta[key],
  }));
};
