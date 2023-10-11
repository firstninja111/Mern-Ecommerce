const graphql = require("graphql");
const mongoose = require("mongoose");
const StoreAvailabilityInput = require("../types/inputs/StoreAvailabilityInput");
const AgendaType = require("../types/AgendaType");

const StoreAvailability = require("../../models/storeAvailability");

const { GraphQLList } = graphql;

const addAgendaMutation = {
  type: AgendaType,
  args: {
    agenda: { type: new GraphQLList(StoreAvailabilityInput) },
  },
  async resolve(parent, args) {
    await StoreAvailability.deleteMany({});

    const result = await StoreAvailability.insertMany(args.agenda);
    return {
      agenda: result,
    }
  },
};

module.exports = addAgendaMutation;
