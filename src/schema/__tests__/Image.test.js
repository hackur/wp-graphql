import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { getMockSchema } from 'jest/utils';

const fields = `
  ... on Image {
    post
    source_url
    media_details {
      sizes {
        name
        source_url
      }
    }
  }
`;

const queryByID = `
  query ImageQuery($id: ID!) {
    viewer {
      media(id: $id) {
        ${fields}
      }
    }
  }
`;

const queryBySlug = `
  query ImageQuery($slug: String!) {
    viewer {
      media(slug: $slug) {
        ${fields}
      }
    }
  }
`;

// https://highforthis.com/wp-json/wp/v2/media/2724

describe('Test Media queries', () => {
  const rootValue = {};
  const context = {};

  const schema = getMockSchema({
    Media: () => ({
      __typename: 'Image',
    }),
    Image: () => ({
      post: toGlobalId('Post', 2723),
      source_url: 'https://scott.com/image.jpg',
    }),
    MediaSize: () => ({
      name: 'thumbnail',
      source_url: 'https://scott.com/image.jpg',
    }),
  });

  test('GraphQL should return a media by ID', async () => {
    const variables = {
      id: toGlobalId('Media', 2724),
    };
    const result = await graphql(schema, queryByID, rootValue, context, variables);
    expect(result).toMatchSnapshot();
  });

  test('GraphQL should return a media by slug', async () => {
    const variables = {
      slug: 'cool-image',
    };
    const result = await graphql(schema, queryBySlug, rootValue, context, variables);
    expect(result).toMatchSnapshot();
  });
});
