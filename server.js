import dotenv from 'dotenv';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import Schema from './schema/index';

dotenv.config();

const port = process.env.GRAPHQL_PORT;

const app = express();
const graphQLServer = graphQLHTTP(req => ({
  graphiql: true,
  schema: Schema,
  rootValue: {
    cookies: req.cookies,
  },
}));

app.use(express.static('public'));

app.use('/graphql', graphQLServer);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`GraphQL Server is now running on ${port}`);
});
