import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import models from './models';

const path = require('path');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');

const typesArray = loadFilesSync(path.join(__dirname, './schema'));
const typeDefs = mergeTypeDefs(typesArray);
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));
const resolvers = mergeResolvers(resolversArray);

const PORT = 4000;

const SECRET = "SECRET";
const SECRET2 = "SECRET2";

const app = express();
app.use(cors('*'));
const graphqlEndpoint = '/graphql';

// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//   },
// };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    models,
    user: {
      id: 1,
    },
    SECRET,
    SECRET2,
  }),
});

server.applyMiddleware({ app, graphqlEndpoint });

models.sequelize.sync({}).then(() => {
  // eslint-disable-next-line no-console
  app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
});
