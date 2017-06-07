import { graphql } from 'graphql';
import schema from 'schema';

// https://highforthis.com/wp-json/wp/v2/statuses

test('GraphQL should return a collection of statuses', async () => {
  const query = `
     query Q {
       statuses {
         id
         name
         public
         queryable
         slug
       }
     }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  const { data: { statuses } } = result;

  statuses.forEach(node => {
    expect(node.id).toBeDefined();
    expect(node.name).toBeDefined();
    expect(node.public).toBe(true);
    expect(node.slug).toBeDefined();
    expect(node.queryable).toBe(true);
  });
});
