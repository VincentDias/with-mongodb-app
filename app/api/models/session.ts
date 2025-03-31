import mongoose, { Schema } from "mongoose";

interface ISession extends Document {
  user_id: string;
  jwt: string;
}

const sessionSchema = new Schema<ISession>({
  user_id: {
    type: String,
    required: true,
  },
  jwt: {
    type: String,
    required: true,
  },
});

const Session = mongoose.models.sessions || mongoose.model("sessions", sessionSchema);

export default Session;
