const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt
} = graphql;

const StoreAvailabilityType = new GraphQLObjectType({
  name: "StoreAvailabilityType",
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

module.exports = StoreAvailabilityType;
