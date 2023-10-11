const graphql = require("graphql");
const StoreAvailabilityType = require("../types/StoreAvailabilityType");
const StoreAvailability = require("../../models/storeAvailability");

const { GraphQLList } = graphql;

const allStoreAvailabilitiesQuery = {
  type: new GraphQLList(StoreAvailabilityType),
  async resolve(parent, args) {
    return await StoreAvailability.find({});
  },
};

module.exports = allStoreAvailabilitiesQuery;
