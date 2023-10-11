const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
} = graphql;

const StoreType = new GraphQLObjectType({
  name: "StoreType",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    coordinateLat: { type: GraphQLString },
    coordinateLng: { type: GraphQLString },
    city: { type: GraphQLString },
    country: { type: GraphQLString },
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
    website: { type: GraphQLString },
    timezone: { type: GraphQLString },
    availableServices: { type: new GraphQLList(GraphQLString) },
    createdAt: { type: GraphQLString },
  }),
});

module.exports = StoreType;
