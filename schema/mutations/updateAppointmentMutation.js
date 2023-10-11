const graphql = require("graphql");
const AppointmentInput = require("../types/inputs/AppointmentInput");
const AppointmentType = require("../types/AppointmentType");
const Appointment = require("../../models/appointment");
const { GraphQLID, GraphQLString } = graphql;

const updateAppointmentMutation = {
  type: AppointmentType,
  args: {
    _id: { type: GraphQLID },
    status: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    let filter = {
      _id: args._id,
    };

    const selectedAppointment = await Appointment.findById({
      _id: args._id,
    });

    const update = {
      status: args.status ? args.status : selectedAppointment.status, // Update status value of appointment - "cancelled" or "checked-in" ...
      checkedInDateTime: args.status == "checked-in" ? Date.now() : selectedAppointment.checkedInDateTime // For checked-in status, we update checkedInDateTime
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
    };
  },
};

module.exports = updateAppointmentMutation;
