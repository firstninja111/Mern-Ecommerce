const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MyRoutine = require("./myroutine");

const currentDate = new Date().toISOString();

const ClientSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  permanentPasswordSet: { type: Boolean, default: false },
  password: String,
  profilePicture: String,
  tokenCount: { type: Number, default: 0 },
  isOnline: {type: Boolean, default: false},
  myRoutine: MyRoutine.schema.obj,
  createdAt: { type: Date, default: currentDate },
});

module.exports = mongoose.model("Client", ClientSchema);
