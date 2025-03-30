import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  jwt: {
    type: String,
    required: true,
  },
});

const Session = mongoose.model("sessions", sessionSchema);

export default Session;
