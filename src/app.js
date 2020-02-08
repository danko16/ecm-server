require('module-alias/register');
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { admin } = require('@utils');
const routes = require('./routes');
const schema = require('./graphql');

const app = express();
const graphqlPath = '/graphql';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/admin', routes.admin);
app.use('/api/v1', routes.v1);

const server = new ApolloServer(schema);
app.use(graphqlPath, admin);
server.applyMiddleware({ app, graphqlPath });

module.exports = app;
