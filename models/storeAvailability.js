const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const StoreAvailabilitySchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  weekday: String,
  hour: String,
  location: String,
  availability: String
});

module.exports = mongoose.model("StoreAvailability", StoreAvailabilitySchema);
