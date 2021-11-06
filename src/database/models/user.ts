import mongoose from 'mongoose'

const userScheme = new mongoose.Schema(
  {
    chat_id: {
      type: Number,
      required: true,
      unique: true,
    },
    last_activity: { type: String },
  },
  { versionKey: false }
)

export default userScheme
