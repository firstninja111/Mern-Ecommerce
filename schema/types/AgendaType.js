const graphql = require("graphql");
const StoreAvailabilityType = require("./StoreAvailabilityType");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt
} = graphql;

const AgendaType = new GraphQLObjectType({
  name: "AgendaType",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    agenda: {type: StoreAvailabilityType}
  }),
});

module.exports = AgendaType;
