const graphql = require("graphql");
const AppointmentInput = require("../types/inputs/AppointmentInput");
const Appointment = require("../../models/appointment");
const { GraphQLID } = graphql;

const processAppointmentMutation = {
  type: AppointmentInput,
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    let filter = {
      _id: args._id,
    };

    const update = {
      isProcessed: true,
    };

    const appointment = await Appointment.findOneAndUpdate(filter, update, {
      new: true,
    });

    const appt_res = await appointment.save();

    return {
      ...appt_res,
      createdAt: appt_res.createdAt,
      esthetician: appt_res.esthetician,
      date: appt_res.date,
      startTime: appt_res.startTime,
      morningOrEvening: appt_res.morningOrEvening,
      endTime: appt_res.endTime,
      duration: appt_res.duration,
      price: appt_res.price,
      isStoreSchedule: appt_res.isStoreSchedule,
      notes: appt_res.notes,
      confirmed: appt_res.confirmed,
      isProcessed: appt_res.isProcessed,
      status: {type: GraphQLString },
    };
  },
};

module.exports = processAppointmentMutation;
