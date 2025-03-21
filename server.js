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
    }

}))

const typeDefs = gql`
type User 
{ id: ID!
  name: String!
  email: String! 
}

type Query 
{  getUsers : [User]
}

type Mutation
{
 createUser(name: String!, email: String!): User 
}
`;

const resolvers = { 
    Query : { 
        getUsers: async () => await User.find(),
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


