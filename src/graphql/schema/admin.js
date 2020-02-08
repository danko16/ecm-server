const { gql } = require('apollo-server-express');
const { admins: Admin } = require('@models');

const typeDef = gql`
  extend type Query {
    admin(id: Int!): Admin!
    admins: [Admin]!
  }

  type Admin {
    id: Int
    full_name: String
    email: String
    phone: String
    password: String
    role: String
    image: String
    createdAt: String
    UpdatedAt: String
  }
`;

// Admin Resolvers
const resolvers = {
  Query: {
    admin: async (root, { id }, { admin }) => {
      try {
        const result = await Admin.findOne({ where: { id } });
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    admins: async () => await Admin.all()
  }
};

module.exports = {
  typeDef,
  resolvers
};
