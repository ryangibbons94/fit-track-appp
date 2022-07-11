const mongoose = require("mongoose");

const weightSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  date: String,
  notes: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

weightSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Weight", weightSchema);
