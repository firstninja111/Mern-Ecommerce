const graphql = require("graphql");
const ClientType = require("./ClientType");
const StoreType = require("./StoreType");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

const AppointmentType = new GraphQLObjectType({
  name: "AppointmentType",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    date: { type: GraphQLString },
    startTime: { type: GraphQLString },
    morningOrEvening: { type: GraphQLString },
    endTime: { type: GraphQLString },
    duration: { type: GraphQLInt },
    price: { type: GraphQLInt },
    isStoreSchedule: { type: GraphQLBoolean },
    service: { type: GraphQLString },
    esthetician: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    client: { type: ClientType },
    store: { type: StoreType },
    notes: { type: GraphQLString },
    confirmed: { type: GraphQLBoolean },
    isProcessed: { type: GraphQLBoolean },
    status: {type: GraphQLString },
    checkedInDateTime: {type:GraphQLString},
    type: {type:GraphQLString},
    priority: {type: GraphQLInt}
  }),
});

module.exports = AppointmentType;
