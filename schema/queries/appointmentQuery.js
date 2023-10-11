const graphql = require("graphql");
const ClientInput = require("../types/inputs/ClientInput");
const AppointmentType = require("../types/AppointmentType");
const Appointment = require("../../models/appointment");
const { UserInputError } = require("apollo-server");

const { GraphQLID, GraphQLString, GraphQLInt } = graphql;

const appointmentQuery = {
  type: AppointmentType,
  args: {
    _id: { type: GraphQLID },
    date: { type: GraphQLString },
    startTime: { type: GraphQLString },
    endTime: { type: GraphQLString },
    morningOrEvening: { type: GraphQLString },
    duration: { type: GraphQLInt },
    price: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email:{ type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    esthetician: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  },
  async resolve(parent, args) {
    let appointment = null;
    if(args._id){
      appointment = await Appointment.findOne({
        _id: args._id
      });
    } else {
      appointment = await Appointment.findOne({
        date: args.date,
        startTime: args.startTime,
        endTime: args.endTime,
        morningOrEvening: args.morningOrEvening,
        duration: args.duration,
        price: args.price,
        esthetician: args.esthetician,
        createdAt: args.createdAt,
      });
    }
    

    if (!appointment) {
      throw new UserInputError("No appointment found.");
    }

    return {
      _id: appointment._id,
      date: appointment.date,
      startTime: appointment.startTime,
      morningOrEvening: appointment.morningOrEvening,
      endTime: appointment.endTime,
      duration: appointment.duration,
      price: appointment.price,
      client: appointment.client,
      notes: appointment.notes,
      confirmed: appointment.confirmed,
      isProcessed: appointment.isProcessed,
      createdAt: appointment.createdAt,
      esthetician: appointment.esthetician,
      isStoreSchedule: appointment.isStoreSchedule,
      service: appointment.service,
    };
  },
};

module.exports = appointmentQuery;
