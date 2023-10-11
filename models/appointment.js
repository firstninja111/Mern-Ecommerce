const mongoose = require("mongoose");
const Client = require("./client");
const Store = require("./store");
const Schema = mongoose.Schema;
const addOnSchema = require("./addon");

const currentDate = new Date().toISOString();

const AppointmentSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: String,
  startTime: String,
  morningOrEvening: String,
  endTime: String,
  duration: Number,
  price: Number,
  isStoreSchedule: {type: Boolean, default: false },
  service: {type: String, default: "" },
  createdAt: { type: Date, default: currentDate },
  client: Client.schema.obj,
  esthetician: String,
  store: Store.schema.obj,
  confirmed: { type: Boolean, default: false },
  isProcessed: { type: Boolean, default: false },
  status: {type: String, default: "scheduled"},
  checkedInDateTime: Date,
  type: String,
  notes: String,
  priority: Number,
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
