import { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString, GraphQLID } from 'graphql';

import { toGlobalId } from 'graphql-relay';

const NavMenuItemType = new GraphQLObjectType({
  name: 'NavMenuItem',
  description: 'A nav menu item.',
  fields: {
    id: {
      type: GraphQLID,
      description: 'Menu item ID.',
      resolve: item => toGlobalId('NavMenuItem', item.id),
    },
    parent: {
      type: GraphQLID,
      description: 'Menu item that this item is a child of.',
      resolve: item => (item.parent > 0 ? toGlobalId('NavMenuItem', item.parent) : null),
    },
    order: {
      type: GraphQLInt,
      description: 'The order that this item appears in the menu.',
    },
    type: {
      type: GraphQLString,
      description: 'The classification of object.',
    },
    object: {
      type: GraphQLString,
      description: 'The type of object.',
    },
    object_id: {
      type: GraphQLID,
      description: 'The id of the object.',
      resolve: item => {
        if (!item.object_id) {
          return null;
        }

        switch (item.object) {
          case 'category':
            return toGlobalId('Category', item.object_id);

          case 'post':
            return toGlobalId('Post', item.object_id);

          default:
            return null;
        }
      },
    },
    label: {
      type: GraphQLString,
      description: 'The object type label.',
    },
    url: {
      type: GraphQLString,
      description: 'The item url.',
    },
    title: {
      type: GraphQLString,
      description: 'The display name for the item.',
    },
    target: {
      type: GraphQLString,
      description: 'The target for the item.',
    },
    attr_title: {
      type: GraphQLString,
      description: 'The attribute title for the item.',
    },
    description: {
      type: GraphQLString,
      description: 'A description of the item.',
    },
    classes: {
      type: new GraphQLList(GraphQLString),
      description: 'CSS classes to use with the item.',
    },
    xfn: {
      type: GraphQLString,
      description: 'Associated XFN value(s).',
    },
  },
});

export default NavMenuItemType;