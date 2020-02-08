const { merge } = require('lodash');

const { admin } = require('./schema');

const query = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;
const typeDefs = [query, admin.typeDef];
const resolvers = merge(admin.resolvers);

const schema = {
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    return res.local.admin;
  }
};

module.exports = schema;
