import { Schema, model } from 'mongoose';



const threadSchema = new Schema({
    ts: {
      type: String,
      required: true,
      unique: true
    },
    sessionId: {
      type: String,
      required: true,
      unique: true
    }
});

export const threadModel = model("thread", threadSchema)
