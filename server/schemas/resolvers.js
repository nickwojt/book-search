const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
// import sign token function from auth
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, { userId, username }) => {
      return User.findOne({
        $or: [{ _id: userId }, { username: username }],
      });
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { userId, bookId }) => {
      return User.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: { savedBooks: bookId },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },
    removeBook: async (parent, { userId, bookId }) => {
      return User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: bookId } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
