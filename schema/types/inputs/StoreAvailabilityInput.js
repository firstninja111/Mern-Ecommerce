const graphql = require("graphql");

const {
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLInputObjectType,
} = graphql;

const StoreAvailabilityInput = new GraphQLInputObjectType({
  name: "StoreAvailabilityInput",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    weekday: { type: GraphQLString },
    hour: { type: GraphQLString },
    location: { type: GraphQLString },
    availability: { type: GraphQLString },
  }),
});

module.exports = StoreAvailabilityInput;
