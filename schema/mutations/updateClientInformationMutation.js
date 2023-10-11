const graphql = require("graphql");
const ClientType = require('../types/ClientType')
const Client = require("../../models/client");
const Appointment = require("../../models/appointment");
const { GraphQLID, GraphQLString } = graphql;

const updateClientInformationMutation = {
  type: ClientType,
  args: {
    _id: { type: GraphQLID },
    _appointId: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    // ===== Search the client and update ==== //
    let filter = {
      _id: args._id,
    };

    const slectedClient = await Client.findById({
      _id: args._id,
    });

    const update = {
      firstName: args.firstName ? args.firstName : slectedClient.firstName,
      lastName: args.lastName ? args.lastName : slectedClient.lastName,
      email: args.email ? args.email : slectedClient.email,
      phoneNumber: args.phoneNumber ? args.phoneNumber : slectedClient.phoneNumber,
    };

    const client = await Client.findOneAndUpdate(filter, update, {
      new: true,
    });
    const appt_res = await client.save();

    // ========= Update client data placed on appointment ======= //
    const appointment = await Appointment.findById({
      _id: args._appointId
    });

    appointment.client.firstName = args.firstName ? args.firstName : appointment.client.firstName;
    appointment.client.lastName = args.lastName ? args.lastName : appointment.client.lastName;
    appointment.client.email = args.email ? args.email : appointment.client.email;
    appointment.client.phoneNumber = args.phoneNumber ? args.phoneNumber : appointment.client.phoneNumber;
    await appointment.save();

    return {
      ...appt_res,
    };
  },
};

module.exports = updateClientInformationMutation;
