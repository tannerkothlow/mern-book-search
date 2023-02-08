const { User } = require('../models');

// Redefine ../controllers/user-controller routes using resolvers.
const resolvers = {
    Query: {
        user: async (parent, args) => {
            return User.findOne({
                $or: [{ _id: args.user ? args.user._id : args.params.id }, { username: args.params.username }],
            });
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create(args);
            return user;
        },
        login: async (parent, args) => {
            const user = await User.findOne({
                $or: [{ username: args.username }, { email: args.email }] 
            });
            if (!user) {
                // Modify return?
                return res.status(400).json({ message: "Can't find this user" });
            }

            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw) {
                return res.status(400).json({ message: 'Wrong password!' });
            }

            const token = signToken(user);

            // res.json({ token, user });

            return { token, user };
        },
        saveBook: async (parent, args) => {
            console.log(args.user);

            const updatedUser = await User.findOneAndUpdate(
                { _id: args.user._id },
                { $addToSet: { savedBooks: args.body } },
                { new: true, runValidators: true }
            );

            return updatedUser;
        },
        deleteBook: async (parent, args) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: args.user._id },
                { $pull: { savedBooks: { bookId: args.params.bookId } } },
                { new: true }
            );
            return updatedUser;
        },
    },
};

module.exports = resolvers;