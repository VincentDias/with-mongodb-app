import mongoose from "mongoose";

interface ISession extends Document {
  user_id: string;
  jwt: string;
}

const sessionSchema = new mongoose.Schema<ISession>({
  user_id: {
    unique: true,
    type: String,
    required: true,
  },
  jwt: {
    type: String,
    required: true,
  },
});

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
