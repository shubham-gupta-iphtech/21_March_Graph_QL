import 'dotenv/config'
import express from "express" 
import { ApolloServer , gql } from "apollo-server-express"
import mongoose from 'mongoose';

const app = express();

//connect to db 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const User = mongoose.model("User", new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    }, 
    password: {
        type: String
    }

}))

const typeDefs = gql`
type User 
{ id: ID!
  name: String!
  email: String! 
}

type AuthPayload
{ 
 token: String!
 user: User!
}

type Query 
{  getUsers : [User]
   me: User
}

type Mutation
{
  register(name: String!, email: String!, password: String!): AuthPayload 
  login(email: String!, password: String!): AuthPayload
}
`;

//importing few packages 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const resolvers = { 
    Query : { 
        getUsers: async () => await User.find(),
        me: async(_)
    }, 
    Mutation : {
        createUser : async (_, {name, email}) => 
        {
            const user = new User({name,email});
            await user.save();
            return user;
        },
    },
};

const server = new ApolloServer({typeDefs, resolvers});

async function startServer() 
{
     await server.start();
     server.applyMiddleware({app});

     app.listen(5000, ()=> {
       console.log(`server listening at port 5000`);
     });
}

startServer();


