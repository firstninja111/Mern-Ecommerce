const graphql = require("graphql");

const {
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLInputObjectType,
} = graphql;

const AgendaInput = new GraphQLInputObjectType({
  name: "AgendaInput",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    // agenda: { type: GraphQLString },
  }),
});

module.exports = AgendaInput;
