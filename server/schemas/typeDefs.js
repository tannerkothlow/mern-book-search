const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        password: String
        savedBooks: [Book]
    }
    type Auth {
    token: ID!
    profile: Profile
    }
    type Query {
        users: [User]
        user(id: ID!): User
    }
    type Mutation {
        addUser:(username: String!, email: String!, password: String!): Book
    }
`;

module.exports = typeDefs;