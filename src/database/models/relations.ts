import mongoose from 'mongoose'

const relationScheme = new mongoose.Schema(
  {
    host_id: {
      type: Number,
      required: true,
    },
    cli_id: {
      type: Number,
      required: true,
    },
    host_like: {
      type: Boolean,
      required: true,
    },
    cli_checked: {
      type: Boolean,
      required: true,
    },
    msg_text: {
      type: String,
    },
  },
  { versionKey: false }
)

export default relationScheme
