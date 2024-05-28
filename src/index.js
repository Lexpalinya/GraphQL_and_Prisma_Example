import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { startStandaloneServer } from "@apollo/server/standalone";
const prisma = new PrismaClient();
const typeDefs = `
  type User {
    id: Int!
    name: String!
    email: String!
    posts: [Post!]!
  }
  type Post {
    id: Int!
    details: String!
    userId: Int!
    user: User!
  }
  type Query {
    users: [User!]!
    user(id: Int!): User!
    posts: [Post!]!
  }
  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: Int!, name: String!, email: String!): User!
    deleteUser(id: Int!): User!
    createPost(details: String!, userId: Int!): Post!
    updatePost(id: Int!, details: String!): Post!
    deletePost(id: Int!): Post!
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await prisma.user.findMany();
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    user: async (_, { id }) => {
      try {
        return await prisma.user.findUnique({ where: { id } });
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    posts: async () => {
      try {
        return await prisma.post.findMany();
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
      }
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      try {
        return await prisma.user.create({
          data: {
            name,
            email,
          },
        });
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    },
    updateUser: async (_, { id, name, email }) => {
      try {
        return await prisma.user.update({
          where: { id },
          data: {
            name,
            email,
          },
        });
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        return await prisma.user.delete({
          where: { id },
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
      }
    },
    createPost: async (_, { details, userId }) => {
      try {
        return await prisma.post.create({
          data: {
            details,
            userId,
          },
        });
      } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Failed to create post");
      }
    },
    updatePost: async (_, { id, details }) => {
      try {
        return await prisma.post.update({
          where: { id },
          data: {
            details,
          },
        });
      } catch (error) {
        console.error("Error updating post:", error);
        throw new Error("Failed to update post");
      }
    },
    deletePost: async (_, { id }) => {
      try {
        return await prisma.post.delete({
          where: { id },
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        throw new Error("Failed to delete post");
      }
    },
  },
  User: {
    posts: async (parent) => {
      try {
        const userPosts = await prisma.post.findMany({
          where: {
            userId: parent.id,
          },
        });
        return userPosts || [];
      } catch (error) {
        console.error("Error fetching user posts:", error);
        throw new Error("Failed to fetch user posts");
      }
    },
  },
  Post: {
    user: async (parent) => {
      try {
        return await prisma.user.findUnique({
          where: {
            id: parent.userId,
          },
        });
      } catch (error) {
        console.error("Error fetching post user:", error);
        throw new Error("Failed to fetch post user");
      }
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server listening at: ${url}`);
