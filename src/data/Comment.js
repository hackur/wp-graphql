import path from 'path';
import { toGlobalId } from 'graphql-relay';
import fetchData, { clearEndpointCache } from 'data/utils';
import Post from 'data/Post';

const commentsEndpoint = process.env.WP_COMMENTS_ENDPOINT || 'graphql/v1/comments';
const postEndpoint = Post.getEndpoint();

class Comment {
  getID() {
    return toGlobalId(this.constructor.name, this.id);
  }

  static getEndpoint() {
    return commentsEndpoint;
  }

  static async clearPostCache(id) {
    if (typeof global.it === 'function') {
      return Promise.resolve();
    }

    const endpoint = `${postEndpoint}/${id}`;
    return Promise.all(
      clearEndpointCache(commentsEndpoint),
      clearEndpointCache(endpoint)
    );
  }

  static async collection(opts = {}) {
    const args = { qs: opts };
    const { data: { body, headers } } = await fetchData(commentsEndpoint, args);
    return {
      total: headers['x-wp-total'],
      items: body.map(item => Object.assign(new Comment(), item)),
    };
  }

  static async create(form) {
    if (!form.author && !(form.author_email && form.author_name)) {
      return Promise.reject('You must provide author data to create a comment.');
    }

    if (!form.post) {
      return Promise.reject('You must provide a post to assign the comment to.');
    }

    try {
      const { data: { body: comment, headers } } = await fetchData(commentsEndpoint, {
        method: 'POST',
        form,
      });

      if (comment) {
        try {
          await Comment.clearPostCache(comment.post);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(`Post cache clearing failed for: ${comment.post}`);
        }
        return {
          status: 'new',
          comment: Object.assign(new Comment(), comment),
          cookies: headers['set-cookie'],
        };
      }

      return {
        comment: null,
        status: 'new',
        cookies: null,
      };
    } catch (e) {
      return {
        comment: null,
        status: e.message || 'There were errors.',
        cookies: null,
      };
    }
  }

  static async update(input) {
    const form = Object.assign({}, input);
    const updateEndpoint = path.join(commentsEndpoint, form.id);
    delete form.id;

    try {
      const { data: { body: comment, headers } } = await fetchData(updateEndpoint, {
        method: 'POST',
        form,
      });

      if (comment) {
        try {
          await Comment.clearPostCache(comment.post);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(`Post cache clearing failed for: ${comment.post}`);
        }
        return {
          status: 'update',
          comment: Object.assign(new Comment(), comment),
          cookies: headers['set-cookie'],
        };
      }

      return {
        comment: null,
        status: 'update',
        cookies: null,
      };
    } catch (e) {
      return {
        comment: null,
        status: e.message,
        cookies: null,
      };
    }
  }

  static async delete(input) {
    const form = Object.assign({}, input);
    const deleteEndpoint = path.join(commentsEndpoint, form.id);

    try {
      const { data: { body: comment } } = await fetchData(deleteEndpoint, {
        method: 'DELETE',
        form,
      });

      try {
        await Comment.clearPostCache(input.post);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Post cache clearing failed for: ${input.post}`);
      }

      if (comment.deleted) {
        return {
          status: 'delete',
        };
      }

      return {
        status: 'delete',
      };
    } catch (e) {
      return {
        status: e.message,
      };
    }
  }
}

export default Comment;
