import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs, resolvers } from './graphql/schema';

const schema = makeExecutableSchema({
    typeDefs, resolvers
})

const server = new ApolloServer({ schema });

server.listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
