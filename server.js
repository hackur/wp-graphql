import 'dotenv/config';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import { graphqlBatchHTTPWrapper } from 'react-relay-network-layer';
import bodyParser from 'body-parser';
import responseTime from 'response-time';
import queryLogger from './middleware/queryLogger';
import Schema from './schema/index';

const app = express();
const graphQLServer = graphQLHTTP(req => ({
  graphiql: true,
  schema: Schema,
  rootValue: {
    cookies: req.cookies,
  },
}));

// uncomment this to output incoming query and request headers
app.use(queryLogger());

app.use(responseTime((req, res, time) => {
  // eslint-disable-next-line no-console
  console.log(`Response time: ${Math.floor(time)}ms`);
}));

app.use(express.static('public'));

app.use(
  '/graphql/batch',
  bodyParser.json(),
  graphqlBatchHTTPWrapper(graphQLServer),
);

app.use('/graphql', graphQLServer);

const server = app.listen(process.env.GRAPHQL_PORT, () => {
  const { address, port } = server.address();
  // eslint-disable-next-line no-console
  console.log(`GraphQL Server is now running on http://${address}:${port}`);
});
