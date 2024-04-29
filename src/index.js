const { PrismaClient } = require('@prisma/client')

const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

const { PubSub } = require('apollo-server')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')

const pubsub = new PubSub()

const prisma = new PrismaClient()
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }
  type Mutation {
    post(url: String!, description: String!): Link!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }]

  const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,
  }

  const server = new ApolloServer({
    typeDefs: fs.readFileSync(
      path.join(__dirname, 'schema.graphql'),
      'utf8'
    ),
    resolvers,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        pubsub,
        userId:
          req && req.headers.authorization
            ? getUserId(req)
            : null
      };
    }
  });

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );