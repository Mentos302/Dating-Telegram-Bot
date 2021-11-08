import mongoose from 'mongoose'

const profileScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    chat_id: {
      type: Number,
      required: true,
    },
    gender: {
      type: Number,
      required: true,
    },
    interest: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    descript: {
      type: String,
    },
    avatar: {
      type: Object,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    strikes: {
      type: Number,
      default: 0,
    },
    activities_block: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    attraction: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
)

export default profileScheme
