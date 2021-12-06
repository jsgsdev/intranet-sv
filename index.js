const { ApolloServer } = require("apollo-server");
const typeDefs = require("./src/db/schema");
const resolvers = require("./src/db/resolvers");

const connectDB = require('./src/config/db');

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

connectDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers['authorization'] || ''
        if(token) {
            try {
                const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA)
                console.log(user)
                return {
                    user
                }
            } catch (error) {
                console.log(error)
            }
        }

    }
})

server.listen().then( ({url}) => {
    console.log(url)
} )