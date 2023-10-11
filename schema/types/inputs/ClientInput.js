const graphql = require("graphql");

const {
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLInputObjectType,
} = graphql;

const ClientInput = new GraphQLInputObjectType({
  name: "ClientInput",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    profilePicture: { type: GraphQLString },
    password: { type: GraphQLString },
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
    tokenCount: { type: GraphQLInt },
    isOnline: { type: GraphQLBoolean},
    createdAt: { type: GraphQLString },
  }),
});

module.exports = ClientInput;
