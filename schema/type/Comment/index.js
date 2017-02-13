import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} from 'graphql';

/* eslint-disable camelcase */

import Post from 'type/Post';
import Avatar from 'type/User/Avatar';
import CommentLinks from 'type/Comment/Links';

import { id, link } from 'field/identifier';
import { content } from 'field/content';
import { date, date_gmt } from 'field/date';
import metaField from 'field/meta';
import author from 'field/author';

import { posts, comments } from 'data';

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'An object.',
  fields: () => ({
    id,
    post: {
      type: Post,
      resolve: comment => (
        comment.post > 0 ? posts.load(comment.post) : null
      ),
    },
    parent: {
      type: Comment,
      resolve: comment => (
        comment.parent > 0 ? comments.load(comment.parent) : null
      ),
    },
    author,
    author_name: { type: GraphQLString },
    author_url: { type: GraphQLString },
    date,
    date_gmt,
    content,
    link,
    status: { type: GraphQLString },
    type: { type: GraphQLString },
    author_avatar_urls: {
      type: new GraphQLList(Avatar),
      resolve: (comment) => {
        Object.keys(comment.author_avatar_urls).map(key => ({
          size: key,
          url: comment.author_avatar_urls[key],
        }));
      },
    },
    meta: metaField(),
    _links: { type: CommentLinks },
  }),
});

export default Comment;
