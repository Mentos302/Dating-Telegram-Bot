import mongoose from 'mongoose'

const cityScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profiles: {
      type: Number,
      default: 0,
    },
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
    },
    cached_distances: {
      type: Array,
    },
  },
  { versionKey: false }
)

export default cityScheme
