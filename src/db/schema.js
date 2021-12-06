const { gql } = require("apollo-server")

const typeDefs = gql`

    type User {
        id: ID 
        name: String 
        lastname: String
        email: String
        role: String
        createAt: String
    }

    type Email {
        email: String
    }

    type Token {
        token: String
    }

    input UserInput {
        name: String!
        lastname: String!
        email: String!
        password: String!
        repeatpassword: String!
    }

    input AuthUserInput {
        email: String!
        password: String!
    }

    input EmailInput {
        email: String!
    }

    type Query {
        #User
        getUser(token: String!) : User
        getUsers: [User]
    }

    type Mutation {
        #User
        createUser(input: UserInput) :  User
        authUser(input: AuthUserInput) : Token
        registerEmail(input: EmailInput) : Email
    }

`

module.exports = typeDefs;