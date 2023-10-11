const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StoreAvailability = require("./storeAvailability");

const AgendaSchema = new Schema({
  agenda: StoreAvailability.schema.obj
});

module.exports = mongoose.model("Agenda", AgendaSchema);
