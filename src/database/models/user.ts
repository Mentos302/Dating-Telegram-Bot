import mongoose from 'mongoose'

const userScheme = new mongoose.Schema(
  {
    chat_id: {
      type: Number,
      required: true,
      unique: true,
    },
    last_activity: { type: String, default: Math.floor(Date.now() / 1000) },
    daily_likes: { type: Number, default: 0 },
    refbonus: { type: Number, default: 0 },
  },
  { versionKey: false }
)

export default userScheme
